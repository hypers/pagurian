<div id="{nameStr}_select_panel{id}" class="sizer-select-panel {multipleClass}">
    <div class="sizer-top">
        <div class="sizer-search-wrap">
            <div class="input-icon input-search">
                <i class="fa fa-search"></i>
                <input id="{nameStr}_search{id}" type="text" placeholder="{search}" class="form-control"
                       maxlength="1024"/>
            </div>
            <div class="sizer-btn-group"></div>
        </div>
        <div id="{nameStr}_listwrap{id}" class="sizer-list-wrap loading">
            <div class="sizer-loading">{processing}</div>
            <ul id="{nameStr}_datalist{id}" class="sizer-data-list"></ul>
        </div>
    </div>
</div>
