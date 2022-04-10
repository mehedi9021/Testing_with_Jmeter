/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 82.22996515679442, "KoPercent": 17.770034843205575};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2886178861788618, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03571428571428571, 500, 1500, "ActivitiesPage"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "ContactMepage-1"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "ContactMepage-0"], "isController": false}, {"data": [0.6323529411764706, 500, 1500, "HomePage-0"], "isController": false}, {"data": [0.029411764705882353, 500, 1500, "HomePage-1"], "isController": false}, {"data": [0.875, 500, 1500, "ActivitiesPage-0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "EducationPage-0"], "isController": false}, {"data": [0.03225806451612903, 500, 1500, "ResearchPage"], "isController": false}, {"data": [0.1, 500, 1500, "OthersPage"], "isController": false}, {"data": [0.031746031746031744, 500, 1500, "EducationPage-1"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "OthersPage-1"], "isController": false}, {"data": [0.015873015873015872, 500, 1500, "EducationPage"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "OthersPage-0"], "isController": false}, {"data": [0.019801980198019802, 500, 1500, "HomePage"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "ResearchPage-0"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "ResearchPage-1"], "isController": false}, {"data": [0.03571428571428571, 500, 1500, "ActivitiesPage-1"], "isController": false}, {"data": [0.027777777777777776, 500, 1500, "ProjectsPage"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "ProjectsPage-1"], "isController": false}, {"data": [0.11538461538461539, 500, 1500, "ContactMepage"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "ProjectsPage-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 861, 153, 17.770034843205575, 5580.9001161440165, 128, 31862, 3350.0, 14440.200000000008, 21378.899999999987, 26946.8, 5.510223672842469, 241.6356364096349, 0.9848559846084926], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ActivitiesPage", 28, 13, 46.42857142857143, 6481.321428571428, 931, 13421, 5779.5, 11047.6, 12618.649999999994, 13421.0, 0.18590816136828406, 14.294050067391709, 0.046561331849387835], "isController": false}, {"data": ["ContactMepage-1", 13, 1, 7.6923076923076925, 1355.5384615384617, 227, 2839, 1324.0, 2831.4, 2839.0, 2839.0, 0.08681367114981368, 5.410418151820416, 0.01306900518210837], "isController": false}, {"data": ["ContactMepage-0", 13, 0, 0.0, 538.6923076923076, 279, 1254, 478.0, 1114.3999999999999, 1254.0, 1254.0, 0.08630762693860208, 0.06430929624429042, 0.014075560252682176], "isController": false}, {"data": ["HomePage-0", 102, 0, 0.0, 707.6078431372551, 321, 1961, 512.0, 1686.2, 1785.25, 1960.73, 0.7906854157299887, 0.5721659111874234, 0.11196229031332847], "isController": false}, {"data": ["HomePage-1", 102, 33, 32.35294117647059, 11518.656862745098, 671, 31340, 9224.5, 25725.4, 26283.6, 31207.519999999997, 0.7613360701623437, 41.73306587049823, 0.07292784334763949], "isController": false}, {"data": ["ActivitiesPage-0", 28, 0, 0.0, 590.7499999999999, 276, 1255, 474.0, 1117.3000000000002, 1214.4999999999998, 1255.0, 0.19075908490141844, 0.1421378728318186, 0.031110124197789916], "isController": false}, {"data": ["EducationPage-0", 63, 0, 0.0, 573.3809523809526, 285, 1415, 490.0, 810.4, 1206.1999999999994, 1415.0, 0.4714863044454423, 0.3508521132689717, 0.07643235013471036], "isController": false}, {"data": ["ResearchPage", 31, 3, 9.67741935483871, 5997.354838709678, 459, 17170, 5615.0, 11185.2, 15042.399999999994, 17170.0, 0.210730964536018, 18.4365629163636, 0.06352996883221057], "isController": false}, {"data": ["OthersPage", 15, 2, 13.333333333333334, 2750.8666666666672, 687, 4844, 2945.0, 4741.4, 4844.0, 4844.0, 0.09930881067768332, 6.932537300803077, 0.029508164839384548], "isController": false}, {"data": ["EducationPage-1", 63, 20, 31.746031746031747, 7333.301587301588, 128, 17869, 6622.0, 13434.2, 14299.0, 17869.0, 0.4523457357439292, 25.708091603601535, 0.050050283075089394], "isController": false}, {"data": ["OthersPage-1", 15, 2, 13.333333333333334, 2271.4, 406, 4362, 2474.0, 4279.8, 4362.0, 4362.0, 0.09949720744504438, 6.871940460871064, 0.013726209803128192], "isController": false}, {"data": ["EducationPage", 63, 20, 31.746031746031747, 7906.9682539682535, 769, 18361, 7168.0, 14045.2, 14949.0, 18361.0, 0.4514187446259673, 25.99132709497707, 0.12312692569504155], "isController": false}, {"data": ["OthersPage-0", 15, 0, 0.0, 479.3333333333333, 281, 1062, 455.0, 822.6000000000001, 1062.0, 1062.0, 0.10005069235079107, 0.07415866747485392, 0.01592603794255756], "isController": false}, {"data": ["HomePage", 101, 33, 32.67326732673267, 12337.554455445541, 1021, 31862, 10143.0, 26686.4, 27018.8, 31769.980000000018, 0.811564390804413, 44.88245970050462, 0.19228984951908784], "isController": false}, {"data": ["ResearchPage-0", 30, 0, 0.0, 544.7666666666668, 283, 1074, 482.5, 831.7000000000002, 1066.85, 1074.0, 0.21034180543382996, 0.15631847063978965, 0.03389296669588081], "isController": false}, {"data": ["ResearchPage-1", 30, 2, 6.666666666666667, 5636.966666666667, 322, 16683, 5213.0, 10709.200000000003, 14740.949999999997, 16683.0, 0.20432626818503788, 18.30325045845706, 0.030728755176265457], "isController": false}, {"data": ["ActivitiesPage-1", 28, 13, 46.42857142857143, 5890.357142857143, 462, 12954, 5068.5, 10473.400000000001, 12163.349999999995, 12954.0, 0.18625070675491404, 14.181608989922506, 0.01627225238633718], "isController": false}, {"data": ["ProjectsPage", 36, 5, 13.88888888888889, 6245.027777777779, 750, 15004, 6364.5, 10234.000000000005, 11998.399999999994, 15004.0, 0.25246681113378633, 20.302244905517803, 0.07571127921777367], "isController": false}, {"data": ["ProjectsPage-1", 36, 5, 13.88888888888889, 5750.583333333332, 464, 14514, 5802.5, 9739.600000000006, 11503.299999999996, 14514.0, 0.25295820568312766, 20.153771196228814, 0.03509877447019309], "isController": false}, {"data": ["ContactMepage", 13, 1, 7.6923076923076925, 1894.5384615384614, 656, 3326, 1868.0, 3298.0, 3326.0, 3326.0, 0.08609214508513188, 5.429599803974808, 0.027000804216528368], "isController": false}, {"data": ["ProjectsPage-0", 36, 0, 0.0, 494.0277777777777, 276, 1154, 477.0, 596.9000000000001, 758.7499999999993, 1154.0, 0.2588568593472493, 0.19237311519849287, 0.04171033378153919], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: socket closed", 4, 2.6143790849673203, 0.4645760743321719], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 143, 93.4640522875817, 16.608594657375146], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 6, 3.9215686274509802, 0.6968641114982579], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 861, 153, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 143, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: socket closed", 4, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["ActivitiesPage", 28, 13, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["ContactMepage-1", 13, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HomePage-1", 102, 33, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 29, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: socket closed", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["ResearchPage", 31, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["OthersPage", 15, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["EducationPage-1", 63, 20, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 20, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["OthersPage-1", 15, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["EducationPage", 63, 20, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 20, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["HomePage", 101, 33, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 29, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: socket closed", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["ResearchPage-1", 30, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ActivitiesPage-1", 28, 13, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: socket closed", 1, null, null, null, null, null, null], "isController": false}, {"data": ["ProjectsPage", 36, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ProjectsPage-1", 36, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["ContactMepage", 13, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
