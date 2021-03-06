var expect = require('expect.js');

var request = require('../../../../lib/request');
var file = require('../../../../lib/actions/file');

describe('actions/file', function() {
    var requestOptions;
    var bogusRequestModule;
    var response;
    var actualResponse;
    var errorMessage;
    var b2;
    var options;

    beforeEach(function() {
        errorMessage = undefined;
        actualResponse = undefined;

        b2 = {
            accountId: '98765',
            authorizationToken: 'unicorns and rainbows',
            apiUrl: 'https://foo',
            downloadUrl: 'https://download'
        };

        bogusRequestModule = function(options, cb) {
            requestOptions = options;
            cb(errorMessage, false, JSON.stringify(response));
        };

        request.setup(bogusRequestModule);
    });

    describe('uploadFile', function() {

        beforeEach(function() {
            options = {
                uploadUrl: 'https://uploadUrl',
                uploadAuthToken: 'uploadauthtoken',
                filename: 'foo.txt',
                data: 'some text file content'
            };
        });

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { foo: '1234' };

                file.uploadFile(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://uploadUrl',
                    method: 'POST',
                    headers:
                    { Authorization: 'uploadauthtoken',
                        'Content-Type': 'b2/x-auto',
                        'X-Bz-File-Name': 'foo.txt',
                        'X-Bz-Content-Sha1': '332e7f863695677895a406aff6d60acf7e84ea22' },
                    body: 'some text file content'
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.uploadFile(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });


    describe('listFileNames', function() {

        beforeEach(function() {
            options = {
                bucketId: '123abc',
                startFileName: 'unicorns.png',
                maxFileCount: 200
            };
        });

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { foo: '1234' };

                file.listFileNames(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v1/b2_list_file_names',
                    method: 'POST',
                    headers:
                    {
                        Authorization: 'unicorns and rainbows'
                    },
                    body: '{"bucketId":"123abc","startFileName":"unicorns.png","maxFileCount":200}'
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.listFileNames(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('listFileVersions', function() {

        beforeEach(function() {
            options = {
                bucketId: '123abc',
                startFileName: 'unicorns.png',
                maxFileCount: 200
            };
        });

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { foo: '1234' };

                file.listFileVersions(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v1/b2_list_file_versions',
                    method: 'POST',
                    headers:
                    {
                        Authorization: 'unicorns and rainbows'
                    },
                    body: '{"bucketId":"123abc","startFileName":"unicorns.png","maxFileCount":200}'
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.listFileVersions(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('hideFile', function() {

        beforeEach(function() {
            options = {
                bucketId: '123abc',
                fileName: 'unicorns.png'
            };
        });

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { foo: '1234' };

                file.hideFile(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v1/b2_hide_file',
                    method: 'POST',
                    headers:
                    {
                        Authorization: 'unicorns and rainbows'
                    },
                    body: '{"bucketId":"123abc","fileName":"unicorns.png"}'
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.hideFile(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('getFileInfo', function() {

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { foo: '1234' };

                file.getFileInfo(b2, 'abc123').then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v1/b2_get_file_info',
                    method: 'POST',
                    headers:
                    {
                        Authorization: 'unicorns and rainbows'
                    },
                    body: '{"fileId":"abc123"}'
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.getFileInfo(b2, 'abc123').then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('downloadFileByName', function() {

        beforeEach(function() {
            options = {
                bucketName: 'unicornBox',
                fileName: 'unicorns.png'
            };
        });

        describe('with good response', function() {

            beforeEach(function(done) {
                response = {
                    headers: {
                        'x-bz-file-id': 'fileIdAbcd1234',
                        'x-bz-file-name': 'unicorns-download.png',
                        'x-bz-content-sha1': 'file_hash'
                    },
                    statusCode: 200
                };

                bogusRequestModule = function(options, cb) {
                    requestOptions = options;
                    cb(errorMessage, response, 'file contents');
                };

                request.setup(bogusRequestModule);

                file.downloadFileByName(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://download/file/unicornBox/unicorns.png',
                    headers: {
                        Authorization: 'unicorns and rainbows'
                    }
                });
                expect(actualResponse).to.eql({
                    data: 'file contents',
                    fileId: 'fileIdAbcd1234',
                    filename: 'unicorns-download.png',
                    sha1: 'file_hash'
                });
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.downloadFileByName(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('downloadFileById', function() {

        describe('with good response', function() {

            beforeEach(function(done) {
                response = {
                    headers: {
                        'x-bz-file-id': 'fileIdAbcd1234',
                        'x-bz-file-name': 'unicorns-download.png',
                        'x-bz-content-sha1': 'file_hash'
                    },
                    statusCode: 200
                };

                bogusRequestModule = function(options, cb) {
                    requestOptions = options;
                    cb(errorMessage, response, 'file contents');
                };

                request.setup(bogusRequestModule);

                file.downloadFileById(b2, 'abcd1234').then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://download/b2api/v1/b2_download_file_by_id',
                    qs: {
                        fileId: 'abcd1234'
                    },
                    headers: {
                        Authorization: 'unicorns and rainbows'
                    }
                });
                expect(actualResponse).to.eql({
                    data: 'file contents',
                    fileId: 'fileIdAbcd1234',
                    filename: 'unicorns-download.png',
                    sha1: 'file_hash'
                });
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.downloadFileById(b2, '1234abcd').then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

    describe('deleteFileVersion', function() {

        beforeEach(function() {
            options = {
                fileId: 'abcd1234',
                fileName: 'foo.txt'
            };
        });

        describe('with good response', function() {

            beforeEach(function(done) {
                response = { foo: '1234' };

                file.deleteFileVersion(b2, options).then(function(response) {
                    actualResponse = response;
                    done();
                });
            });

            it('should set correct options and resolve with good response', function() {
                expect(requestOptions).to.eql({
                    url: 'https://foo/b2api/v1/b2_delete_file_version',
                    method: 'POST',
                    headers: {
                        Authorization: 'unicorns and rainbows'
                    },
                    body: '{"fileId":"abcd1234","fileName":"foo.txt"}'
                });
                expect(actualResponse).to.eql(response);
            });
        });

        describe('with error response', function() {

            beforeEach(function(done) {
                errorMessage = 'Something went wrong';

                file.deleteFileVersion(b2, options).then(null, function(error) {
                    actualResponse = error;
                    done();
                });
            });

            it('Should respond with an error and reject promise', function() {
                expect(actualResponse).to.be(errorMessage);
            });
        });

    });

});
