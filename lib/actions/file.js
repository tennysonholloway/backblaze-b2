var sha1 = require('node-sha1');
var q = require('q');

var utils = require('./../utils');
var request = require('../request');
var conf = require('../../conf');

exports.uploadFile = function(b2, args) {
    var uploadUrl = args.uploadUrl;
    var uploadAuthToken = args.uploadAuthToken;
    var filename = encodeURIComponent(args.filename);
    var data = args.data;

    var options = {
        url: uploadUrl,
        method: 'POST',
        headers: {
            Authorization: uploadAuthToken,
            'Content-Type': 'b2/x-auto',
            'X-Bz-File-Name': filename,
            'X-Bz-Content-Sha1': data ? sha1(data) : null
        },
        body: data
    };
    return request.sendRequest(options);
};

exports.listFileNames = function(b2, args) {
    var bucketId = args.bucketId;
    var startFileName = args.startFileName;
    var maxFileCount = args.maxFileCount;

    var options = {
        url: getListFilesUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        body: JSON.stringify({
            bucketId: bucketId,
            startFileName: startFileName ? startFileName : '',
            maxFileCount: maxFileCount ? maxFileCount : 100
        })
    };
    return request.sendRequest(options);
};

exports.listFileVersions = function(b2, args) {
    var bucketId = args.bucketId;
    var startFileName = args.startFileName;
    var maxFileCount = args.maxFileCount;

    var options = {
        url: getListFileVersionsUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        body: JSON.stringify({
            bucketId: bucketId,
            startFileName: startFileName ? startFileName : '',
            maxFileCount: maxFileCount ? maxFileCount : 100
        })
    };
    return request.sendRequest(options);
};

exports.hideFile = function(b2, args) {
    var bucketId = args.bucketId;
    var fileName = encodeURIComponent(args.fileName);

    var options = {
        url: getHideFileUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        body: JSON.stringify({
            bucketId: bucketId,
            fileName: fileName
        })
    };
    return request.sendRequest(options);
};

exports.getFileInfo = function(b2, fileId) {
    var options = {
        url: getFileInfoUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        body: JSON.stringify({
            fileId: fileId
        })
    };
    return request.sendRequest(options);
};

exports.downloadFileByName = function(b2, args) {
    var bucketName = args.bucketName;
    var fileName = encodeURIComponent(args.fileName);

    var options = {
        url: getDownloadFileByNameUrl(b2, bucketName, fileName),
        headers: utils.getAuthHeaderObjectWithToken(b2)
    };

    var deferred = q.defer();

    var requestInstance = request.getInstance();
    requestInstance(options, utils.getProcessFileSuccess(deferred, processDownloadResponse));

    return deferred.promise;
};

exports.downloadFileById = function(b2, fileId) {
    var options = {
        url: getDownloadFileByIdUrl(b2),
        qs: {
            fileId: fileId
        },
        headers: utils.getAuthHeaderObjectWithToken(b2)
    };

    var deferred = q.defer();

    var requestInstance = request.getInstance();
    requestInstance(options, utils.getProcessFileSuccess(deferred, processDownloadResponse));

    return deferred.promise;
};

exports.deleteFileVersion = function(b2, args) {
    var fileId = args.fileId;
    var fileName = encodeURIComponent(args.fileName);

    var options = {
        url: getDeleteFileVersionUrl(b2),
        method: 'POST',
        headers: utils.getAuthHeaderObjectWithToken(b2),
        body: JSON.stringify({
            fileId: fileId,
            fileName: fileName
        })
    };

    return request.sendRequest(options);
};

function processDownloadResponse(response, body) {
    var headers = [
        { key: 'X-Bz-File-Id', name: 'fileId' },
        { key: 'X-Bz-File-Name', name: 'filename' },
        { key: 'X-Bz-Content-Sha1', name: 'sha1' }
    ];

    var obj = { data: body };

    headers.forEach(processHeader);

    function processHeader(headersMapping) {
        var key = headersMapping.key.toLowerCase();
        var name = headersMapping.name;
        obj[name] = response.headers[key];
    }

    return obj;
}

function getListFilesUrl(b2) {
    return getApiUrl(b2) + '/b2_list_file_names';
}

function getListFileVersionsUrl(b2) {
    return getApiUrl(b2) + '/b2_list_file_versions';
}

function getHideFileUrl(b2) {
    return getApiUrl(b2) + '/b2_hide_file';
}

function getFileInfoUrl(b2) {
    return getApiUrl(b2) + '/b2_get_file_info';
}

function getDownloadFileByNameUrl(b2, bucketName, fileName) {
    return b2.downloadUrl + '/file/' + bucketName + '/' + fileName;
}

function getDownloadFileByIdUrl(b2) {
    return b2.downloadUrl + conf.API_VERSION_URL + '/b2_download_file_by_id';
}

function getDeleteFileVersionUrl(b2) {
    return getApiUrl(b2) + '/b2_delete_file_version';
}

function getApiUrl(b2) {
    return b2.apiUrl + conf.API_VERSION_URL;
}
