var json_output = function (data) {
    var new_return = '';
    for (const key in data[0]) {
        if (data[0].hasOwnProperty(key)) {
            if (/^\d+$/.test(data[0][key])) {
                new_return += '"' + key + '" : Number(rec.' + key + '),';
            } else {
                new_return += '"' + key + '" : rec.' + key + ',';
            }
        }
    }

    var query = '' +
        'nowdb.from(data).select(function(rec) {' +
        '   return {' +
        new_return +
        '   }' +
        '});';

    var exec_query = eval(query);

    return exec_query;
}

var json_output_custom = function (data, attribute, type) {
    var exec_query = data;

    if (data.length > 0) {
        var new_attribute = [];
        var new_type = [];
        var new_return = '';

        var attribute_split = attribute.split('AND');
        for (i = 0; i < attribute_split.length; i++) {
            new_attribute.push(attribute_split[i]);
        }

        var type_split = type.split('AND');
        for (i = 0; i < type_split.length; i++) {
            new_type.push(type_split[i]);
        }

        var query = '';
        if (new_type.length === new_attribute.length) {
            for (i = 0; i < new_attribute.length; i++) {
                if (new_type[i] === 'int') {
                    new_return += '"' + new_attribute[i] + '" : parseInt(rec.' + new_attribute[i] + '),';
                } else if (new_type[i] === 'float') {
                    new_return += '"' + new_attribute[i] + '" : parseFloat(rec.' + new_attribute[i] + '),';
                } else if (new_type[i] === 'number') {
                    new_return += '"' + new_attribute[i] + '" : Number(rec.' + new_attribute[i] + '),';
                } else {
                    new_return += '"' + new_attribute[i] + '" : rec.' + new_attribute[i] + ',';
                }
            }

            query = 'nowdb.from(data).select(function(rec) {return {' + new_return + '}});';
        } else {
            query = 'nowdb.from(data).select()';
        }
        exec_query = eval(query);
    } else {
        exec_query = [];
    }

    return exec_query;
}

var json_filter = function (data_array, data_attribute, data_operator, data_value) {
    var final_data = data_array;
    if (data_array.length > 0) { // If data empty
        var new_attribute = [];
        var new_operator = [];
        var new_value = [];

        if (data_attribute != '' && data_operator != '' && data_value != '') { // If parameter ok
            var attribute_split = data_attribute.split('OR');
            var operator_split = data_operator.split('OR');
            var value_split = data_value.split('OR');

            var data_ANOR = [];
            data_ANOR.push(null);

            // Array from AND/OR attribute
            for (i = 0; i < attribute_split.length; i++) {
                var y = attribute_split[i].split('AND');
                if (y.length > 1) {
                    for (j = 0; j < y.length; j++) {
                        new_attribute.push(y[j]);
                        if (j < (y.length) - 1) {
                            data_ANOR.push('AND');
                        }
                    }
                    data_ANOR.push('OR');
                } else {
                    new_attribute.push(attribute_split[i]);
                    if (i < (attribute_split.length) - 1) {
                        data_ANOR.push('OR');
                    }
                }
            }

            // Array from AND/OR operator
            for (i = 0; i < operator_split.length; i++) {
                var y = operator_split[i].split('AND');
                if (y.length > 1) {
                    for (j = 0; j < y.length; j++) {
                        new_operator.push(y[j]);
                    }
                } else {
                    new_operator.push(operator_split[i]);
                }
            }

            // Array from AND/OR value
            for (i = 0; i < value_split.length; i++) {
                var y = value_split[i].split('AND');
                if (y.length > 1) {
                    for (j = 0; j < y.length; j++) {
                        new_value.push(y[j]);
                    }
                } else {
                    new_value.push(value_split[i]);
                }
            }

            if (new_attribute.length === new_operator.length && new_operator.length === new_value.length) { //cek jika jumlah semua attribut dan value sama
                var query = "nowdb.from(data_array)";

                var i = 0;
                while (i < new_attribute.length) {
                    if (new_operator[i] === 'equals') {
                        if (data_ANOR[i] === 'AND') {
                            query += ".equals('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orEquals('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else {
                            query += ".equals('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        }
                    } else if (new_operator[i] === 'notEquals') {
                        if (data_ANOR[i] === 'AND') {
                            query += ".andNotEquals('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orNotEquals('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else {
                            query += ".notEquals('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        }
                    } else if (new_operator[i] === 'contains') {
                        if (data_ANOR[i] === 'AND') {
                            query += ".contains('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orContains('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else {
                            query += ".contains('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        }
                    } else if (new_operator[i] === 'notContains') {
                        if (data_ANOR[i] === 'AND') {
                            query += ".andNotContains('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orNotContains('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else {
                            query += ".notContains('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        }
                    } else if (new_operator[i] === 'greater') {
                        if (data_ANOR[i] === 'AND') {
                            query += ".greater('" + new_attribute[i] + "', " + new_value[i] + ")";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orGreater('" + new_attribute[i] + "', " + new_value[i] + ")";
                        } else {
                            query += ".greater('" + new_attribute[i] + "', " + new_value[i] + ")";
                        }
                    } else if (new_operator[i] === 'greaterEquals') {
                        if (data_ANOR[i] === 'AND') {
                            query += ".greaterEquals('" + new_attribute[i] + "', " + new_value[i] + ")";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orGreaterEquals('" + new_attribute[i] + "', " + new_value[i] + ")";
                        } else {
                            query += ".greaterEquals('" + new_attribute[i] + "', " + new_value[i] + ")";
                        }
                    } else if (new_operator[i] === 'less') {
                        if (data_ANOR[i] === 'AND') {
                            query += ".less('" + new_attribute[i] + "', " + new_value[i] + ")";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orLess('" + new_attribute[i] + "', " + new_value[i] + ")";
                        } else {
                            query += ".less('" + new_attribute[i] + "', " + new_value[i] + ")";
                        }
                    } else if (new_operator[i] === 'lessEquals') {
                        if (data_ANOR[i] === 'AND') {
                            query += ".lessEquals('" + new_attribute[i] + "', " + new_value[i] + ")";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orLessEquals('" + new_attribute[i] + "', " + new_value[i] + ")";
                        } else {
                            query += ".lessEquals('" + new_attribute[i] + "', " + new_value[i] + ")";
                        }
                    } else if (new_operator[i] === 'starts') {
                        if (data_ANOR[i] === 'AND') {
                            query += ".starts('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orStarts('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else {
                            query += ".starts('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        }
                    } else if (new_operator[i] === 'ends') {
                        if (data_ANOR[i] === 'AND') {
                            query += ".ends('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orEnds('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else {
                            query += ".ends('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        }
                    } else if (new_operator[i] === 'between') {
                        var min_value = new_value[i].split('_')[0];
                        var max_value = new_value[i].split('_')[1];
                        if (data_ANOR[i] === 'AND') {
                            query += ".between('" + new_attribute[i] + "', " + min_value + ", " + max_value + ")";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orBetween('" + new_attribute[i] + "', " + min_value + ", " + max_value + ")";
                        } else {
                            query += ".between('" + new_attribute[i] + "', " + min_value + ", " + max_value + ")";
                        }
                    } else if (new_operator[i] === 'betweenEquals') {
                        var min_value = new_value[i].split('_')[0];
                        var max_value = new_value[i].split('_')[1];
                        if (data_ANOR[i] === 'AND') {
                            query += ".betweenEquals('" + new_attribute[i] + "', " + min_value + ", " + max_value + ")";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orBetweenEquals('" + new_attribute[i] + "', " + min_value + ", " + max_value + ")";
                        } else {
                            query += ".betweenEquals('" + new_attribute[i] + "', " + min_value + ", " + max_value + ")";
                        }
                    } else if (new_operator[i] === 'empty') {
                        if (data_ANOR[i] === 'AND') {
                            query += ".empty('" + new_attribute[i] + "')";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orEmpty('" + new_attribute[i] + "')";
                        } else {
                            query += ".empty('" + new_attribute[i] + "')";
                        }
                    } else if (new_operator[i] === 'notEmpty') {
                        if (data_ANOR[i] === 'AND') {
                            query += ".andNotEmpty('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else if (data_ANOR[i] === 'OR') {
                            query += ".orNotEmpty('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        } else {
                            query += ".notEmpty('" + new_attribute[i] + "', '" + new_value[i] + "')";
                        }
                    }

                    i++;
                }
                query += '.select();';

                final_data = eval(query);
            } else {
                // Do Nothing
            }
        } else {
            var query = "nowdb.from(data_array).select()";
            final_data = eval(query);
        }
    } else {
        // Do Nothing
    }

    return final_data;
}

var json_join = function (data_master, data_merge, result_name, attribute_data_master, attribute_data_merge) {
    var query = 'nowdb.from(data_master).join(data_merge, "' + result_name + '", "' + attribute_data_master + '", "' + attribute_data_merge + '").select()';
    var exec_query = eval(query);

    return exec_query;
}

var json_sum = function (data, attribute) {
    var exec_query = null;
    if (data.length > 0 && (attribute != '' || attribute != null)) {
        var query = "nowdb.from(data).sum('" + attribute + "')";
        exec_query = eval(query)
    } else {
        exec_query = []
    }

    return exec_query;
}

var json_count = function (data, attribute) {
    var exec_query = null;
    if (data.length > 0 && (attribute != '' || attribute != null)) {
        var query = "nowdb.from(data).count('" + attribute + "')";
        exec_query = eval(query)
    } else {
        exec_query = []
    }

    return exec_query;
}

var json_average = function (data, attribute) {
    var exec_query = null;
    if (data.length > 0 && (attribute != '' || attribute != null)) {
        var query = "nowdb.from(data).average('" + attribute + "')";
        exec_query = eval(query)
    } else {
        exec_query = []
    }

    return exec_query;
}

var json_min = function (data, attribute) {
    var exec_query = null;
    if (data.length > 0 && (attribute != '' || attribute != null)) {
        var query = "nowdb.from(data).min('" + attribute + "')";
        exec_query = eval(query)
    } else {
        exec_query = []
    }

    return exec_query;
}

var json_max = function (data, attribute) {
    var exec_query = null;
    if (data.length > 0 && (attribute != '' || attribute != null)) {
        var query = "nowdb.from(data).max('" + attribute + "')";
        exec_query = eval(query)
    } else {
        exec_query = []
    }

    return exec_query;
}

var json_group = function (data, attribute) {
    var exec_query = null;
    if (data.length > 0 && (attribute != '' || attribute != null)) {
        var query = "nowdb.from(data).group('" + attribute + "')";
        exec_query = eval(query)
    } else {
        exec_query = []
    }

    return exec_query;
}

var json_distinct = function (data, attribute) {
    var exec_query = null;
    if (data.length > 0 && (attribute != '' || attribute != null)) {
        var query = "nowdb.from(data).distinct('" + attribute + "')";
        exec_query = eval(query)
    } else {
        exec_query = []
    }

    return exec_query;
}

var json_skip = function (data, skip_record) {
    var exec_query = null;
    if (data.length > 0 && (skip_record != '' || skip_record != null)) {
        var query = "nowdb.from(data).skip('" + skip_record + "').select()";
        exec_query = eval(query)
    } else {
        exec_query = []
    }

    return exec_query;
}

var json_take = function (data, take_record) {
    var exec_query = null;
    if (data.length > 0 && (take_record != '' || take_record != null)) {
        var query = "nowdb.from(data).take('" + take_record + "')";
        exec_query = eval(query)
    } else {
        exec_query = []
    }

    return exec_query;
}

var json_skipTake = function (data, skip_record) {
    var exec_query = null;
    if (data.length > 0 && (skip_record != '' || skip_record != null)) {
        var query = "nowdb.from(data).skipTake('" + skip_record + "')";
        exec_query = eval(query)
    } else {
        exec_query = []
    }

    return exec_query;
}

var json_sort = function (data, attribute, decorator) {
    var exec_query = data_array;
    // console.log(data_array);

    if (data.length > 0) {
        var new_attribute = [];
        var new_decorator = [];

        var attribute_split = attribute.split('AND');
        for (i = 0; i < attribute_split.length; i++) {
            new_attribute.push(attribute_split[i]);
        }

        var decorator_split = decorator.split('AND');
        for (i = 0; i < decorator_split.length; i++) {
            new_decorator.push(decorator_split[i]);
        }

        if (new_attribute.length === new_decorator.length) {
            var query = "nowdb.from(data)";
            for (i = 0; i < new_attribute.length; i++) {
                if (new_decorator[i] === 'asc') {
                    query += ".sort('" + new_attribute[i] + "')";
                } else if (new_decorator[i] === 'desc') {
                    query += ".sort('-" + new_attribute[i] + "')";
                }
            }

            query += '.select()';
            exec_query = eval(query);
        } else {
            // Do Nothing
        }

    }
    return exec_query;
}

var json_first = function (data) {
    var exec_query = null;
    if (data.length > 0) {
        var query = "nowdb.from(data).first()";
        exec_query = eval(query)
    } else {
        exec_query = []
    }

    return exec_query;
}

var json_last = function (data) {
    var exec_query = null;
    if (data.length > 0) {
        var query = "nowdb.from(data).last()";
        exec_query = eval(query)
    } else {
        exec_query = []
    }

    return exec_query;
}