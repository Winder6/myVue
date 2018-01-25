class Observer {
    constructor(data) {
        if (!data || Object.prototype.toString.call(data) !== '[object Object]') {
            return console.log('请传入对象')
        }
        this.data = data;
        this.walk(data);
        this.handlers = {}
    }

    walk(data, parent) {
        if (parent) {
            data.parent = parent
        }
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (Object.prototype.toString.call(data[key]) === '[object Object]') {
                    let parent = data.parent ? data.parent + '.' + key : key;
                    this.walk(data[key], parent)
                    // new Observer(data[key]);
                }
                this.convert(data, key, data[key])
            }
        }
    }

    convert(data, key, value) {
        let _data = data;
        let _this = this;
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            set(v) {
                // console.log(`你设置了${key}，新的值为${v}`);
                if (Object.prototype.toString.call(v) === '[object Object]') {
                    _this.walk(v)
                    // new Observer(data[key]);
                }
                value = v;
                // console.log('_', data);

                //向上传递事件
                if(data.parent){
                    _this.emit(data.parent+'.'+key,v);
                    let x=data.parent.split('.');
                    let l = x.length;
                    for(let i=0; i < l; i++){
                        _this.emit(x.join('.'),v);
                        x.pop();
                    }
                }else {
                    _this.emit(key,v);
                }

                // _this.emit(key, v, data.parent)
            },
            get() {
                // console.log(`你访问了 ${key}`);
                return value
            }
        });
    }

    $watch(key, cb) {
        let _this=this;
        this.on(key, function (data) {
            console.log('__', _this.data[key]);
            let path = key.split('.');
            // [name,firstname,s]
            let val=_this.data;
            for(let i=0; i < path.length; i++){
                val=val[path[i]]
            }
            cb.call(_this,val)
        });
    }

    on(key, handler) {
        this.handlers[key] = handler
    }

    emit(key, data, parent) {
        this.handlers[key]&&this.handlers[key](data);
        // this.handlers[parent]&&this.handlers[parent](data);
    }
}

// let app1= new Observer({
//     name: 'youngwind',
//     age: 25,
//     info:{
//         sex:'male',
//         hello:{
//             s:1
//         }
//     }
// });
// let a=app1.data;
//
//
// app1.data.name = {
//     lastName: 'liang',
//     firstName: 'shaofeng'
// };
//
// app1.$watch('age', function(age) {
//     console.log(`我的年纪变了，现在已经是：${age}岁了`)
// });
//
// app1.data.age=15;
//
// app1.data.info.sex='1';
// console.log(app1);

let app2 = new Observer({
    name: {
        firstName: {
          s:1
        },
        lastName: 'liang'
    },
    age: 25
});

app2.$watch('name.firstName', function (newName) {
    console.log('我的姓名发生了变化，是姓氏变了',newName)
});

app2.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});

app2.$watch('name.firstName.s', function (data) {
    console.log(`s变成了${data}`)
});

app2.$watch('age', function (data) {
    console.log(`age变成了${data}`)
});

app2.data.name.firstName.s = 'hahaha';
// app2.data.age=1;


