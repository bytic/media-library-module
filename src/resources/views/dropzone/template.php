<!-- Dropzone file previews container -->
<div class="row g-2 dropzone-previews" id="dropzone-previews">
    <!-- File preview template (hidden, used by Dropzone.js) -->
    <div class="col-6 col-sm-4 col-md-3 dropzone-file-template" style="display: none;">
        <div class="dz-file-card h-100">
            <div class="preview">
                <img class="img-fluid" data-dz-thumbnail alt="Preview"/>
            </div>
            <div class="dz-file-info">
                <div class="dz-details">
                    <div class="dz-filename small fw-medium text-truncate" title=""><span data-dz-name></span></div>
                    <div class="dz-size small text-muted"><span data-dz-size></span></div>
                    <div class="dz-error-message text-danger small mt-1" style="display:none;"><span data-dz-errormessage></span></div>
                </div>
            </div>
            <div class="progress dz-progress" style="height: 3px;">
                <div class="progress-bar" role="progressbar" style="width: 0%;" data-dz-uploadprogress></div>
            </div>
            <div class="actions">
                <button type="button" class="btn btn-xs btn-sm btn-primary start" title="Upload this file">
                    <i class="fas fa-upload"></i>
                </button>
                <button type="button" data-dz-remove class="btn btn-xs btn-sm btn-outline-warning cancel" title="Cancel">
                    <i class="fas fa-ban"></i>
                </button>
                <button type="button" data-dz-remove class="btn btn-xs btn-sm btn-danger delete" style="display: none;" title="Remove">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Dropzone drag-and-drop area -->
<div class="dz-upload-area mt-3" id="dz-drop-area">
    <div class="dz-upload-icon">
        <i class="fas fa-cloud-upload-alt"></i>
    </div>
    <p class="dz-upload-text mb-1">Drag &amp; drop files here</p>
    <p class="small text-muted mb-0">or use the <strong>Browse files</strong> button below</p>
</div>
