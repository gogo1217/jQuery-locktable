# jquery.locktable  插件

本插件是轻量级的锁定表头插件.代码示例:

```html

    <head>
     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
     <!--引入所需要资源文件-->
     <link href="css/lock-table.css" type="text/css" rel="stylesheet">
     <script type="text/javascript" src="lib/jquery/jquery.min.js"></script>
     <script type="text/javascript" src="js/locktable.js"></script>
    </head>
    <body>
    
    <!-- 普通的table结构,需要在table加上 nowrap保证不自动换行,列的宽度恰好可以将内容显示完全 -->

    <table class='lock-table nowrap'>
        <thead>
            <tr>
           //....
        </thead>
        <tbody>
        </tbody>
    </table>

    <script>
        $('#table1').locktable({
            width: 500,
            height: 300,
        });
    </script>

    </body>
```

