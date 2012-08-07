<div class="{{prefix}}">
    <ul class="{{prefix}}-ctn" data-role="items">
        {{#each items}}
            <li data-role="item" class="{{../prefix}}-item" data-value="{{value}}">{{highlightItem ../prefix}}</li>
        {{/each}}
    </ul>
        {{items.length}}
</div>
