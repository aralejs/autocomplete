<div class="{{prefix}}">
    <ul class="{{prefix}}-ctn" data-role="list">
        {{#each list}}
            <li data-role="item" class="{{../prefix}}-item" data-value="{{value}}">{{highlightItem ../prefix}}</li>
        {{/each}}
    </ul>
</div>
