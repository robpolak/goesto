var CampaignModel = require('../../src/models/campaignModel');
var FileModel = require('../../src/models/fileModel');
var campaignController = require('../../src/controllers/admin/campaign/campaignController');
var campaignImportController = require('../../src/controllers/admin/campaign/campaignImportController');
var fileController = require('../../src/controllers/system/fileController');
var routeController = require('../../src/controllers/system/routeController');
var authController = require('../../src/controllers/system/authController');
var express = require('express');
var routes = express.Router();
var userPermissions = require('../../src/models/userPermissions');
var apiUtil = require('../../src/core/apiUtil');
var authRouter = routeController.authRoute(routes);
var moment = require('moment');

this.addCampaign = function (req, res, next) {
  var campaign = new CampaignModel(req.body);

  campaignController.saveAndValidateCampaign(campaign, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  });
};

this.updateCampaign = function (req, res, next) {
  var campaign = new CampaignModel(req.body);

  campaignController.updateCampaign(campaign, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, campaign, 200);
    }
  });
};

this.deleteCampaign = function (req, res, next) {
  var id = req.params.id;
  var campaign = new CampaignModel(req.body);
  campaign.is_active = false;
  campaign.is_deleted = true;

  campaignController.deleteCampaign(campaign, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, campaign, 200);
    }
  });
};

this.getCampaigns = function (req, res, next) {
  campaignController.getCampaigns(function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, apiUtil.convertArrayToObject(data), 200);
    }
  });
};

this.getCampaign = function (req, res, next) {
  var id = req.params.id;
  if(!id)
    apiUtil.returnObjectAndNext(req, res, next, {}, 400);

  campaignController.getCampaign(id,function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  });
};

this.getCampaignPermissions = function(req,res,next) {
  var id = req.params.id;
  if (!id)
    apiUtil.returnObjectAndNext(req, res, next, {}, 400);

  campaignController.getCampaignPermissions(id, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  })
};

this.getPendingContactUploadsForUser = function (req, res, next) {
  var user_id = req.user._id;
  var campaign_id = req.params.id;
  if(!user_id || !campaign_id) {
    apiUtil.returnObjectAndNext(req, res, next, {}, 400);
    return;
  }

  fileController.getFileForUserAndCampaign(user_id, campaign_id,function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  });
};

this.uploadCampaignContacts = function (req, res, next) {
  var campaignId = req.params.id;
  var data = "";
  var cancelled = false;

  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);
    var ext = filename.substr(filename.length-3);
    if(ext.toLowerCase() != 'csv')
    {
      cancelled = true;
      apiUtil.returnObjectAndNext(req, res, next, {}, 400);
      return;
    }
    file.on('data', function(chunk) {
      data = data + chunk;
    });

    file.on('end', function () {
      if(!cancelled) {
        var model = new FileModel();
        model.user_id = req.user._id;
        model.upload_type = model.fileTypes.campaign_contacts;
        model.expiration_date = moment().add(4, 'hours');
        model.upload_date = new Date();
        model.file_name = filename;
        model.mime_type = 'text/csv';
        model.campaign_id = campaignId;
        console.log("Upload Finished of " + filename);
        fileController.saveAndValidateFile(model, data, function (err, data) {
          apiUtil.returnObjectAndNext(req, res, next, data, 200);
        });
      }

    });
  });
};

this.deleteFileUpload = function (req, res, next) {
  var campaign_id = req.params.id;
  var file_id = req.params.fileId;
  var user_id = req.user._id;
  if(!campaign_id || !file_id || !user_id){
    apiUtil.returnObjectAndNext(req, res, next, {}, 400);
    return;
  }

  fileController.deleteFileForUserAndCampaign(file_id, campaign_id, user_id, function(done) {
    apiUtil.returnObjectAndNext(req, res, next, {}, 200);
  })

};

this.processContactImport = function(req, res, next) {
  var campaign_id = req.params.id;
  var file_id = req.params.fileId;
  var user_id = req.user._id;

  if(!campaign_id || !file_id || !user_id){
    apiUtil.returnObjectAndNext(req, res, next, {}, 400);
    return;
  }

  campaignImportController.runPreImport(file_id, campaign_id, user_id, function(err, data) {
    if(!data) {
      apiUtil.returnObjectAndNext(req, res, next, {}, 400);
    }
    apiUtil.returnObjectAndNext(req, res, next, data, 200);
  });
};

this.addCampaignPermission = function(req,res,next) {
  var permission = req.body;
  var campaign_id = req.params.id;
  if(!campaign_id){
    return apiUtil.returnObjectAndNext(req,res,next,{},400)
  }
  var formattedRequest = {_id:campaign_id,permissions:permission};
  campaignController.addCampaignPermission(formattedRequest, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next,data, 200);
    }
  });
};

this.removeCampaignPermission = function(req,res,next) {
  var permission = req.body;
  var campaign_id = req.params.id;
  if(!campaign_id){
    return apiUtil.returnObjectAndNext(req,res,next,{},400)
  }
  var formattedRequest = {_id:campaign_id,permissions:permission};
  campaignController.removeCampaignPermission(formattedRequest, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next,data, 200);
    }
  });
};

this.completeImport = function(req, res, next) {
  var campaign_id = req.params.id;
  var file_id = req.params.fileId;
  var mapping = req.body;

  campaignImportController.processImport(file_id, campaign_id, mapping, function(err, data) {
    apiUtil.returnObjectAndNext(req, res, next, data, 200);
  });


};

//GET Routes
authRouter.get([userPermissions.admin_edit_campaign, userPermissions.admin_view_campaign], '/api/campaign/:id/permissions', this.getCampaignPermissions);
authRouter.get([userPermissions.admin_edit_campaign, userPermissions.admin_view_campaign], '/api/campaigns', this.getCampaigns);
authRouter.get([userPermissions.admin_edit_campaign, userPermissions.admin_view_campaign], '/api/campaign/:id', this.getCampaign);
authRouter.get([userPermissions.admin_edit_campaign_contacts], '/admin/campaign/:id/contacts/upload/pending', this.getPendingContactUploadsForUser);
authRouter.get([userPermissions.admin_edit_campaign_contacts], '/admin/campaign/:id/contacts/upload/pending/:fileId/process', this.processContactImport);
//DELETES
authRouter.delete([userPermissions.admin_edit_campaign_contacts], '/admin/campaign/:id/contacts/upload/pending/:fileId', this.deleteFileUpload);  //when i run my unit tests for campaign services and i leave the delete routes in I get weird error "TypeError: undefined is not a function" even when not testing these methods
authRouter.delete([userPermissions.admin_edit_campaign], '/api/campaign/:id/permissions',this.removeCampaignPermission);
authRouter.delete([userPermissions.admin_edit_campaign], '/api/campaign/:id', this.deleteCampaign);
//Post routes
authRouter.post([userPermissions.admin_edit_campaign], '/api/campaign', this.addCampaign);
authRouter.post([userPermissions.admin_edit_campaign_contacts], '/admin/campaign/:id/contacts/upload', this.uploadCampaignContacts);
authRouter.post([userPermissions.admin_edit_campaign_contacts], '/admin/campaign/:id/contacts/upload/pending/:fileId/complete', this.completeImport);

//PUT
authRouter.put([userPermissions.admin_edit_campaign], '/api/campaign/:id', this.updateCampaign);
authRouter.put([userPermissions.admin_edit_campaign, userPermissions.admin_view_campaign], '/api/campaign/:id/permissions', this.addCampaignPermission);

this.routes = routes;

module.exports = this;