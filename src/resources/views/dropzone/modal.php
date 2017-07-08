<div id="dropzone-modal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div class="modal-title">
                    <h4>Modal title</h4>

                    <ul class="nav nav-pills" id="ImgTab">
                        <li class="active"><a href="#uplod">Upload</a>
                        </li>
                        <li><a href="#frm-url">URL</a>
                        </li>
                        <li><a href="#frm-gallery">Gallery</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="modal-body">
                <div id='content-gallery' class="tab-content">
                    <div class="tab-pane active" id="uplod">
                        <form action="UploadImages" class="dropzone" id="my-awesome-dropzone"
                              enctype="multipart/form-data">
                        </form>
                    </div>
                    <div class="tab-pane" id="frm-url">
                        <form action="FetchFromUrl">
                            <div class="control-group">
                                <div class="controls form-inline">
                                    <label for="url">URL</label>
                                    <input type="text" class="form-control" placeholder="http://" id="url-ip"
                                           style="width: 450px">
                                    <input type="submit" class="btn btn-success" id="b-url">
                                </div>
                            </div>
                        </form>
                        <div id="url-i-pr"></div>
                    </div>
                    <div class="tab-pane" id="frm-gallery"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Done</button>
            </div>
        </div>
    </div>
</div>
