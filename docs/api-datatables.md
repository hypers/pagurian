###参数

-   分页
    +   page        //当前页码
    +   pagesize　  //每页数目
-   排序
    +   orderColumn     //排序字段
    +   orderType       //排序类型（desc/asc）
-   业务参数
    +   begin (YYYY-MM-DD)
    +   end (YYYY-MM-DD)
    +   dateType：HOUR,DAY,WEEK,MONTH    
    +   ...

###响应
```js
    {
        "code":"200000",              //HTTP状态  
        "message":"......",           //服务器返回消息
        "result":{
            "summary":{}
            "items":[
                {...},{...},{...}
            ]
        },
        "page":{
            "current":1,     //分页信息-当前页
            "pagesize":10,   //分页信息-每页数目
            "total":20       //分页信息-总记录数
        },
        "fields":{          //错误信息（字段）列表
                "field1":[{"code":"","message":""}]
                "field2":[{"code":"","message":""}]
        }
    }
```
