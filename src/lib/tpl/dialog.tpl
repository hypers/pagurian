<div class="modal fade" id="modal{id}">
    <div class="modal-dialog ">
        <div class="modal-content">
            <div class="modal-header">
                <button aria-hidden="true" data-dismiss="modal" class="close" type="button"></button>
                <h4 class="modal-title">{title}</h4>
            </div>
            <div class="modal-body">
                <div class="modal-message"></div>
                {body}
            </div>
            <div class="modal-footer">
                <div id="whisper{id}" class="whisper whisper-success"></div>
                <span class="submit-waiting"></span>
                <button id="btn_submit{id}" class="btn btn-primary" type="button">{btn_submit}</button>
                <button id="btn_cancel{id}" data-dismiss="modal" class="btn btn-default" type="button">{btn_cancel}</button>
            </div>
        </div>
    </div>
</div>
