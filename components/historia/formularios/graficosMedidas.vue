<template>
  <div>
    <!--
      <apexchart v-if="series.length" type="line" :options="chartOptions" :series="series" height="350" />
      <p v-else>Cargando datos...</p>
    -->
  </div>
</template>

<script>
  //import VueApexCharts from 'vue-apexcharts';

  export default {
    components: {
    //  apexchart: VueApexCharts,
    },
    props: ['datos'],
    data() {
      return {
        series: [],
        chartOptions: {
          chart: {
            type: 'line',
            toolbar: {
              show: true, // Mostrar la barra de herramientas
            },
          },
          stroke: {
            curve: 'smooth',
            width: 2,
          },
          xaxis: {
            title: {
              text: 'Longitud (cm)', // Etiqueta del eje X
            },
            labels: {
              formatter: (value) => `${value} cm`, // Formato de las etiquetas del eje X
            },
            min: 45, // Valor mínimo del eje X
            max: 110, // Valor máximo del eje X
            tickAmount: 10, // Cantidad de marcas en el eje X
          },
          yaxis: {
            title: {
              text: 'Peso (kg)', // Etiqueta del eje Y
            },
            labels: {
              formatter: (value) => `${value} kg`, // Formato de las etiquetas del eje Y
            },
            min: 1, // Valor mínimo del eje Y
            max: 26, // Valor máximo del eje Y
            tickAmount: 10, // Cantidad de marcas en el eje Y
          },
          title: {
            text: 'Peso para la Talla Niños (0-2)', // Título del gráfico
            align: 'center',
            style: {
              fontSize: '18px',
            },
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // Colores de las líneas de la cuadrícula
              opacity: 0.5, // Opacidad de las líneas de la cuadrícula
            },
          }, // Agrega una cuadrícula al gráfico
          tooltip: {
            enabled: true,
            x: {
              formatter: (value) => `Estatura: ${value} cm`
            },
            y: {
              formatter: (value) => `Peso: ${value} kg`
            },
          },
        },
      };
    },
    mounted() {
      this.obtenerMedidas();
    },
    methods: {
      obtenerMedidas() {
        this.$axios.post('historia/examenFisico', {
          afiliado: this.datos.afiliado.id
        }).then(res => {
          this.series = [{
            name: 'Peso para Talla',
            data: res.data.map(item => [item.talla, item.peso])
          }];
        }).catch(error => {
          console.log(error);
        });
      }
    },
  };
</script>
