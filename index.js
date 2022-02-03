/**
 * Example problem with existing solution and passing test.
 * See problem 0 in the spec file for the assertion
 * @returns {string}
 */
exports.example = () => 'hello world';


const myTypeof = (data, type) => Object.prototype.toString.call(data) === `[object ${type}]`
const isObject = (data) => myTypeof(data, 'Object')
const isArray = (data) => myTypeof(data, 'Array')
const isFunction = (data) => myTypeof(data, 'Function')
const isString = (data) => myTypeof(data, 'String')

/**
 * 过滤给定的数据项中指定的属性
 * @param {Array} props 被过滤的属性
 * @param {Array} data 需要过滤的数据
 * @returns {Array}
 */
exports.stripPrivateProperties = (props, data) => {
    // if(!isArray(props)){throw TypeError('datas 参数必须是Array类型')}
    // if(!isObject(datas)){throw TypeError('datas 参数必须是Object类型')}
    if (!isArray(props) || !isArray(data)) return data;
    return data.map((item) => {
        props.forEach((key) => {
            delete item[key]
        })
        return item
    })
};
/**
 * 过滤数组项中包括指定属性的项
 * @param {String} prop 指定的属性
 * @param {Array} list 数据
 * @returns {Array}
 */
exports.excludeByProperty = (prop, list) => {
    // 如果有多个属性，可以把prop改为数组
    if (!isArray(list) || !isString(prop)) return list
    return list.filter((item) => item[prop] === undefined)
};

/**
 * 计算指定项的值
 * @param {Array} list 数据项
 * @param {String} key 指定的属性
 * @returns {Array}
 */
exports.sumDeep = (list, key = "objects") => {
    return list.map((item) => {
        item[key] = item[key].reduce((pre, curr) => ({ val: pre.val + curr.val })).val
        return item
    })
};
/**
 * 
 * @param {Object} colors 
 * @param {Array} statusList 
 * @returns {Array}
 */
exports.applyStatusColor = (colors, statusList) => {

    if (!isObject(colors) || !isArray(statusList)) { return [] }
    const colorMap = new Map()
    // 把所有给定color的status 进行哈希
    for (let [color, status] of Object.entries(colors)) {
        status.forEach((state) => {
            colorMap.set(state, color)
        })
    }

    const result = []
    for (let item of statusList) {
        const color = colorMap.get(item.status)
        // 过滤掉没有color的status
        if (color !== undefined) {
            result.push({ ...item, color })
        }
    }
    return result
};
/**
 * 
 * @param {Function} fn 被调用的函数
 * @param {any} arg1 fn的第一个参数
 * @returns {Function}
 */
exports.createGreeting = (fn, arg1) => {
    // 如果fn 不是函数，指定一个匿名函数，返回传入的fn，保证行为的一致性
    if (!isFunction(fn)) { fn = () => fn }
    let len = fn.length
    const args = [arg1]
    const cb = (arg) => {
        args.push(arg)
        return --len > 1 ? cb : fn.apply(null, args)
    }
    return cb
};
/**
 * 
 * @param {Object} def 
 * @returns {Object}
 */
exports.setDefaults = (def) => {
    return (arg) => ({ ...def, ...arg })
};
/**
 * 返回 Promise ，fulfilled 值是稳定的结构
 * @param {String} name 
 * @param {Object} services 
 * @returns {Promise}
 */
exports.fetchUserByNameAndUsersCompany = (name, services = {}) => {
    let userData = { user: {}, status: {}, company: {} }
    //如果name不合法，直接返回 fulfiled 为空数据
    // 这里也可以返回 Promise.reject 走catch逻辑，
    if (!isString || name === '') { return Promise.resolve(userData) }
    return Promise.all([services.fetchUsers(), services.fetchStatus()]).then((usersAndStatus) => {
        const [users, status] = usersAndStatus
        const user = users.filter((item) => item.name === name)[0] || {}
        userData = { ...userData, user, status }

        return user.companyId ? services.fetchCompanyById(user.companyId) : {}
    }).then((company) => {
        return { ...userData, company }
    })
};
