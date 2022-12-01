window.onload = function () {
    if ($("#ts-chart").length) {
      $.ajax({
        url: "pieData",
        success: (response) => {
          const data1 = {
            labels: response.name,
            datasets: [{
              label: "labels",
              data: response.data,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
          };
          const myChart = new Chart(
            document.getElementById('ts-chart'), {
              type: 'pie',
              data: data1,
            }
          );
        }
      });
    }
    if ($("#line-chart").length) {
      $.ajax({
        url: "linegraph",
        success: (response) => {
          var data = {
            labels: response.name,
            datasets: [{
              axis: 'y',
              label: "Amount",
              data: response.data,
              fill: false,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderWidth: 1
            }]
          };
  
          const myChart = new Chart(
            document.getElementById('line-chart'), {
              type: 'bar',
              data,
              options: {
                indexAxis: 'y',
              }
            }
          );
  
        }
      })
    }
    if ($("#year-chart").length) {
      $.ajax({
        url: "yearly",
        success: (response) => {
          var ctx = document.getElementById("year-chart").getContext("2d");
          var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: "line",
            options: {
              scales: {
                xAxes: [{
                  type: "time",
                }, ],
              },
            },
            
            // The data for our dataset
            data: {
              labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                // "Dec",
              ],
              datasets: [{
                  label: "Sales",
                  tension: 0.3,
                  fill: true,
                  backgroundColor: "rgba(44, 120, 220, 0.2)",
                  borderColor: "rgba(44, 120, 220)",
                  data: response.orderCounts,
                }
              ],
            },
            options: {
              plugins: {
                legend: {
                  labels: {
                    usePointStyle: true,
                  },
                },
              },
            },
          });
        }
      })
    }
  }