// 此脚本在于更正选择的item的缩写，注意需要在async的情况下运行

var zoteroPane = Zotero.getActiveZoteroPane();
var selectedItems = zoteroPane.getSelectedItems();

var path = 'D:\\Documents\\VSCode\\zotero.js\\jnls.json';
var data = await Zotero.File.getContentsAsync(path);
var jnlList = JSON.parse(data);

var ignoreItems = new Array();

var specialJnls = new Array(
    'The Journal of Physical Chemistry Letters',
    'The Journal of Physical Chemistry A',
    'The Journal of Physical Chemistry B',
    'The Journal of Physical Chemistry C',
    'The Journal of Chemical Physics'
)

Array.from(selectedItems).forEach(async (v, i) => {
    var jnl = v.getField('publicationTitle');

    // 这几个奇怪的期刊，需要去掉The
    if (specialJnls.includes(jnl)) {
        jnl = jnl.replace('The ', '');
        v.setField('publicationTitle', jnl);
        await v.saveTx();
    }

    // 更新期刊的缩写
    if (jnlList.hasOwnProperty(jnl)) {
        v.setField('journalAbbreviation', jnlList[jnl])
        await v.saveTx();
    } else {
        ignoreItems.push({
            'key': v.getField('key'),
            'publicationTitle': jnl
        });
    }
});

return ignoreItems;