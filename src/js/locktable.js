$.fn.extend({
    /**
     * 解析表格的列宽度
     * @returns {Array} 列的宽度
     */
    parseHeadWidth: function () {
        var $trs = $(this).children('thead').children('tr'),
            tempW = 0,
            widths = [],
            MERGE = 'M',
            r = 0,
            c = 0,
            i = 0,
            j = 0;

        for (r = 0; r < $trs.length; r++) {
            widths[r] = [];
        }

        for (r = 0; r < $trs.length; r++) {
            var $cols = $($trs[r]).children(),
                colW = widths[r],
                pos = 0;//偏移值,可能存在上下合并单元格

            for (c = 0; c < $cols.length; c++) {
                //计算偏移量
                while (colW[c + pos] && colW[c + pos] != 'MERGE') {
                    pos++;
                }

                var col = $cols[c];
                tempW = $(col).outerWidth();

                for (i = 0; i < col.rowSpan; i++) {
                    if (col.colSpan > 1) {
                        tempW = MERGE;
                        for (j = 0; j < col.colSpan; j++) {
                            widths[r + i][c + pos] = tempW;
                        }
                    } else {
                        widths[r + i][c + pos] = tempW;
                    }
                }
                pos += col.colSpan - 1;

            }
        }

        for (r = 0; r < widths.length; r++) {
            var w = widths[r];
            for (c = 0; c < w.length; c++) {
                if (w[c] == MERGE) {
                    break;
                }
                if (c == w.length - 1) {
                    return w;
                }
            }
        }
        if (console) {
            console.log('表头的存在不合理的合并单元格,可能会导致合并单元格数据不合理');
        }
        return [];
    },
    /**
     * 锁定表格
     * @param cfg 配置信息,包含以下信息
     *  {height} [Number] 锁定表格的高度,默认300px
     *  {width} [Number] 锁定表格的宽度,默认400px
     *  {lockColNum} [Number] 锁定列,默认为1
     *  {colWidths} [Array] 锁定表格列的宽度,需和未合并单元格的列一一对应
     */
    locktable: function (cfg) {
        if (!cfg) {
            return;
        }

        //如果没有默认值,则给一个默认值
        if (!cfg.height) {
            cfg.height = 300;
        }
        if (!cfg.width) {
            cfg.width = 400;
        }
        if (!cfg.lockColNum) {
            cfg.lockColNum = 1;
        }

        //计算总宽度
        var $this = $(this),
            width = 0,
            lockWidth = 1,
            colWidths = cfg.colWidths || $this.parseHeadWidth(),
            lockColNum = cfg.lockColNum;


        for (var i = 0; i < colWidths.length; i++) {
            width += colWidths[i];
            if (lockColNum > i) {
                lockWidth += colWidths[i];
            }
        }

        //add colgroup & css & width
        var $body = $this.addClass('lock-table')
            .prepend('<colgroup><col width="' + colWidths.join('px"><col width="') + 'px"></colgroup>')
            .wrap('<div class="lock-wrap-body"></div>')
            .width(width);

        var $container = $body.parent()
            .wrap('<div class="lock-wrap"></div>')
            .parent();

        //clone top
        var $top = $('<table class="lock-table"></table>')
            .wrap('<div class="lock-wrap-top"></div>')
            .width($body.width())
            .height($body.children('thead').height());

        $body.children('colgroup')
            .clone()
            .appendTo($top);

        $body.children('thead')
            .clone()
            .appendTo($top);

        $container.prepend($top.parent());

        //clone left
        var $left = $body.clone().wrap('<div class="lock-wrap-left"></div>');
        $container.prepend($left.parent());

        //clone corn
        var $corn = $top.clone().wrap('<div class="lock-wrap-corn"></div>');
        $container.prepend($corn.parent());

        //计算去掉滚动条的宽度和高度
        var scrollW = 15,
            yScroll = $body.outerHeight() > cfg.height ? scrollW : 0,
            xScroll = $body.outerWidth() > cfg.width ? scrollW : 0;

        $body = $body.parent();
        $left = $left.parent();
        $top = $top.parent();
        $corn = $corn.parent();
        //设置滚动条
        $body.css({
            width: cfg.width,
            height: cfg.height
        }).scroll(function () {
            $left.scrollTop($body.scrollTop());
            $top.scrollLeft($body.scrollLeft());
        });

        $left.css({
            height: cfg.height - yScroll,
            width: lockWidth
        });

        $top.css({
            width: cfg.width - xScroll
        });
        $corn.css({
            width: lockWidth
        });

    }
});
