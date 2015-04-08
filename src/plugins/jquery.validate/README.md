# jquery.validate [![spm version](http://spmjs.io/badge/jquery.validate)](http://spmjs.io/package/jquery.validate)

---

An awesome spm package!

---

## Install

```
$ spm install jquery.validate --save
```

## Usage

```js
var $ = require('jquery');
require('jquery.validate')($);

$("#form").validate({});//use
```
```html
<!doctype html>
<html>
<head>
    <title>jQuery Validation Plugin demo </title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <script src="http://cdn.staticfile.org/seajs/2.3.0/sea.js"></script>

    <script type="text/javascript">
        <!--
        seajs.config({
            base: '/dist',
            alias: {
                'jquery': 'jquery/2.1.1/jquery',
                'jquery.validate':'jquery.validate/1.13.0/jquery.validate'
            }
        });

        seajs.use(['jquery','jquery.validate'],function($,validate) {
            validate($);
            $("#form").validate({
                rules: {
                    firstname: "required",
                    lastname: "required",
                    username: {
                        required: true,
                        minlength: 2
                    },
                    password: {
                        required: true,
                        minlength: 5
                    },
                    confirm_password: {
                        required: true,
                        minlength: 5,
                        equalTo: "#password"
                    }
                },
                messages: {
                    firstname: "Please enter your firstname",
                    lastname: "Please enter your lastname",
                    username: {
                        required: "Please enter a username",
                        minlength: "Your username must consist of at least 2 characters"
                    },
                    password: {
                        required: "Please provide a password",
                        minlength: "Your password must be at least 5 characters long"
                    },
                    confirm_password: {
                        required: "Please provide a password",
                        minlength: "Your password must be at least 5 characters long",
                        equalTo: "Please enter the same password as above"
                    }
                }
            });
        });
        //-->
    </script>

</head>

<body>
    <form id="form">
        <fieldset>
            <legend>Validating a complete form</legend>
            <p>
                <label for="firstname">Firstname</label>
                <input id="firstname" name="firstname" type="text">
            </p>
            <p>
                <label for="lastname">Lastname</label>
                <input id="lastname" name="lastname" type="text">
            </p>
            <p>
                <label for="username">Username</label>
                <input id="username" name="username" type="text">
            </p>
            <p>
                <label for="password">Password</label>
                <input id="password" name="password" type="password">
            </p>
            <p>
                <label for="confirm_password">Confirm password</label>
                <input id="confirm_password" name="confirm_password" type="password">
            </p>
        </fieldset>
        <input type="submit" value="提交"/>
    </form>
</body>
</html>
```

## 修改
+ 将`jquery.validate.js`封装:
```js
    module.exports = function(jQuery) {
        @jquery.validate.js
    };
```
