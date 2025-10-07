<template>
  <div>
    <v-card elevation="1">
      <v-card elevation="0">
        <v-card-title>
          <v-toolbar flat>
            <v-toolbar-title>
              <div class="d-flex align-center">
                <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                <span>Evaluación del desempeño laboral</span>
              </div>
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
        </v-card-title>
      </v-card>
      <v-row dense>
        <!-- Widget -->
        <v-col cols="12" sm="4" md="3">
          <v-card class="pa-4" outlined>
            <Widget v-for="emp in empleados" :key="emp.color" :color="emp.color" :icon="emp.icon" :title="emp.title"
              :subTitle="emp.subTitle" :supTitle="emp.supTitle" />
          </v-card>
        </v-col>

        <!-- Tabla de explicación -->
        <v-col cols="12" sm="8" md="9">
          <div class="tg-wrap">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>PORCENTAJE OBTENIDO EN LA EVALUACIÓN</th>
                  <th>NIVEL DE DESARROLLO DE COMPETENCIAS</th>
                  <th>MAPA CALOR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0% - 20%</td>
                  <td>Debilidad en las competencias</td>
                  <td class="heatmap-cell heatmap-low"></td>
                </tr>
                <tr>
                  <td>21% - 40%</td>
                  <td>Competencias con oportunidades de mejora</td>
                  <td class="heatmap-cell heatmap-medium-low"></td>
                </tr>
                <tr>
                  <td>41% - 60%</td>
                  <td>Competencias aceptables</td>
                  <td class="heatmap-cell heatmap-medium"></td>
                </tr>
                <tr>
                  <td>61% - 80%</td>
                  <td>Fortaleza en las competencias</td>
                  <td class="heatmap-cell heatmap-medium-high"></td>
                </tr>
                <tr>
                  <td>81% - 100%</td>
                  <td>Dominio de la competencia</td>
                  <td class="heatmap-cell heatmap-high"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </v-col>
      </v-row>
    </v-card>


    <!-- Panel de seleccion -->
    <v-card elevation="0">
      <v-form>
        <v-container fluid>
          <v-row align="center">
            <v-col class="d-flex" cols="12" sm="6" md="3">
              <v-autocomplete no-data-text="Sin empleados faltantes por evaluación" :items="listaEmpleados"
                item-text="nombre_completo" item-value="documento" v-model="documento" label="Selecciona el colaborador"
                @change="consultarDatos(documento)" dense outlined>
              </v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="12" sm="6" md="3">
              <v-autocomplete no-data-text="No hay plantilla disponible para seleccionar" :items="plantillas"
                item-text="nombre" item-value="id" v-model="evaluacion.plantilla_id" label="Selecciona la plantilla"
                dense outlined></v-autocomplete>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3" md="2">
              <v-text-field dense type="date" v-model="evaluacion.fecha_inical_periodo"
                label="fecha inicial del Periodo"></v-text-field>
            </v-col>

            <v-col class="d-flex" cols="12" sm="3" md="2">
              <v-text-field dense type="date" v-model="evaluacion.fecha_final_periodo" label="fecha final del Periodo">
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <!-- Pabel de datos del colaborador -->
      <v-container fluid v-if="documento">
        <v-alert dense text border="left" color="blue-grey" icon="mdi-book-account-outline">Datos básicos del empleado a
          evaluar:
          <strong>{{datosEmpleado.nombre_completo}}</strong></v-alert>
        <v-row dense>
          <v-col class="d-flex" cols="12" sm="2">
            <v-text-field readonly dense v-model="datosEmpleado.documento" label="Documento"></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="2">
            <v-text-field readonly dense v-model="datosEmpleado.genero" label="Sexo"></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field readonly dense v-model="datosEmpleado.email_corporativo" label="Correo Institucional">
            </v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="1">
            <v-text-field readonly dense v-model="datosEmpleado.edad" label="Edad"></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="3">
            <v-text-field readonly dense v-model="datosEmpleado.nivel_estudio" label="Nivel de estudio">
            </v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="6">
            <v-text-field readonly dense v-model="datosEmpleado.cargo" label="Cargo"></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="2">
            <v-text-field readonly dense v-model="datosEmpleado.fecha_ingreso" label="Fecha de ingreso"></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="2">
            <v-btn small color="primary" dark @click="generarEvaluacionDesempeno()">
              Generar evaluacion de desempeño</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card v-if="resultadoConsultado != ''" class="pa-4 elevation-2">
      <v-simple-table dense>
        <table>
          <!-- Encabezado General -->
          <tr v-if="plantillaEvaluacion != ''">
            <td colspan="16" class="text-center" style="background-color: #75bc1e; color: black; font-weight: bold;">
              EVALUACIÓN DE COMPETENCIAS
            </td>
          </tr>
          <tr v-if="plantillaEvaluacion != ''">
            <td colspan="16" class="text-center" style="background-color: #75bc1e70; color: black;">
              Competencias Organizacionales
            </td>
          </tr>
          <tbody v-for="item in miPlantilla" :key="item.id">
            <template>
              <div v-for="pilares in item.pilares" :key="pilares.nombre">
                <!-- Encabezado del Pilar -->
                <tr>
                  <td colspan="16" class="pa-2 text-center"
                    style="background-color: #e3f2fd; font-weight: bold; font-size: 1.2rem;">
                    {{ pilares.nombre }} -
                    {{ 'Porcentaje: ' + pilares.porcentaje + '%' }}
                    ({{ porcentajePilares['pilar' + pilares.competencias[0].th_pilar_id] }})
                  </td>
                </tr>
                <!-- Competencias -->
                <tr v-for="competencia in pilares.competencias" :key="competencia.nombre">
                  <td colspan="8" class="pa-2" style="text-align: justify; line-height: 1.6; word-wrap: break-word;">
                    {{ competencia.descripcion }}
                  </td>
                  <td colspan="4" class="text-center">
                    {{ competencia.competencia }}
                  </td>
                  <td colspan="4" class="text-center">
                    <v-radio-group dense v-model="radio['competencia' + competencia.id]" row
                      @change="guardarEvaluacion(competencia.id)">
                      <v-radio v-for="value in [1, 2, 3, 4, 5]" :key="value" :color="getColor(value)"
                        :style="{ color: getColor(value), marginLeft: '3px', transform: 'scale(1.2)' }" :value="value"
                        :label="value" :off-icon="getIcon(value)" :on-icon="getIconOn(value)">
                      </v-radio>
                    </v-radio-group>
                  </td>
                </tr>
              </div>
            </template>
          </tbody>
        </table>
        <br />
        <v-alert text border="left" prominent type="warning" icon="mdi-information-variant-circle-outline">
          Al finalizar la evaluación de desempeño se generará el certificado
          de realización del proceso,
          <p><b>las competencias con calificación inferior a 4 (61% - 80%) generarán un registro
              de compromiso a los cuales se les podrá realizar seguimiento en el módulo de Plan seguimiento
              individual.</b></p>
        </v-alert>
        <div class="text-center mt-4">
          <v-btn block color="success" dark @click="finalizarEvaluacion(resultadoConsultado.id)">
            Finalizar evaluación desempeño de {{ datosEmpleado.nombre_completo }}
          </v-btn>
        </div>
      </v-simple-table>
    </v-card>

  </div>
</template>

<script>
  import {
    mapActions
  } from "vuex"
  import moment from 'moment';
  import CalificacionComponent from '~/components/evaluacionDesempeno/CalificacionComponent.vue';
  import Widget from '~/components/widget/Widget.vue';
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('evaluacionDesempeno.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonEvaluacionDesempeO',
    components: {
      Widget,
      CalificacionComponent
    },
    data() {
      return {
        configuracion: {
          fecha_inicio_evaluacion_desempeno: '',
          fecha_final_evaluacion_desempeno: ''
        },
        diferenciaMeses: 0,
        porcentajePilares: {},
        sumaTotal: {},
        radio: {},
        resultadoConsultado: '',
        competencia: null,
        plantillaEvaluacion: [],
        datosEmpleado: {},
        documento: '',
        plantillas: [],
        listaEmpleados: [],
        miPlantilla: [],
        fechaActual: '',
        items: ['', 'Nivel directivo', 'Nivel táctico con personal a cargo', 'Nivel táctico sin personal a cargo',
          'Nivel técnico asistencial'
        ],
        evaluacion: {
          plantilla_id: '',
          fecha_inical_periodo: '',
          fecha_final_periodo: ''
        },
        empleados: [{
            color: '#00b297',
            icon: 'mdi-human-capacity-decrease',
            title: '0',
            subTitle: 'Colaboradores a cargo',
          },

        ],
      };
    },

    mounted() {
      this.listarEmpleados()
      this.consultarEmpleados()
      this.consultarFechaEvaluacion()
      this.fechaActualColombia()
    },

    methods: {

      ...mapActions('app', ['setPreload']),

      fechaActualColombia() {
        let fechaActual = new Date();
        let anio = fechaActual.getFullYear();
        let mes = fechaActual.getMonth() + 1; // Se suma 1 porque los meses se indexan desde 0 (enero es 0)
        let dia = fechaActual.getDate();

        // Formateo de la fecha
        let fechaFormateada = dia + '/' + mes + '/' + anio;
        this.fechaActual = fechaFormateada
      },

      consultarEmpleados() {
        this.setPreload(true);
        this.$axios.get('empleados/contadoresEmpleadosPorJefeInmediato').then(res => {
          this.empleados[0].title = `${res.data[0]}`;
          this.empleados[1].title = `${res.data[1]}`;
          this.setPreload(false);
        });
      },

      generarFechaEvaluacion() {
        this.setPreload(true);
        if (this.configuracion.inicio_evaluacion_desempeno == '') {
          return this.$toast.error('debe ingresar la fecha inicial')
        }
        if (this.configuracion.fecha_final_evaluacion_desempeno == '') {
          return this.$toast.error('debe ingresar la fecha inicial')
        }
        this.$axios.post('/th-configuracion/crear', this.configuracion).then(res => {
          this.$toast.success('fecha de evaluacion desempeño parametrizada con exito!.')
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        }).finally(() => {
          this.setPreload(false);
        })
      },

      consultarFechaEvaluacion() {
        this.setPreload(true);
        this.$axios.get('/th-configuracion/fechaEvaluacion').then(res => {
          this.configuracion.fecha_final_evaluacion_desempeno = res.data.fecha_final_evaluacion_desempeno
          this.configuracion.fecha_inicio_evaluacion_desempeno = res.data.fecha_inicio_evaluacion_desempeno
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        }).finally(() => {
          this.setPreload(false);
        })
      },

      guardarEvaluacion(competencia_id) {
        this.setPreload(true);
        const requets = {
          th_competencia_id: competencia_id,
          evaluaciones_desempeno_id: this.resultadoConsultado.id,
          calificacion: this.radio['competencia' + competencia_id]
        }
        this.$axios.post('/calificacion-competencia/crear', requets).then(res => {
          this.$toast.success('competencia guardada con exito!.')
          this.generarPlantilaAcalificar(this.evaluacion.plantilla_id)
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        }).finally(() => {
          this.setPreload(false);
        })
      },

      consultarEvaluciacion(datos) {
        this.setPreload(true);
        const $request = {
          evaluaciones_desempeno_id: datos.id,
          th_competencia_id: datos.calificacion
        }
        this.$axios.post('/calificacion-competencia/calificaciones', $request).then(res => {
          let obj = {}
          res.data.forEach(s => {
            obj['competencia' + String(s.th_competencia_id)] = s.calificacion;
          });
          this.radio = obj

        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        }).finally(() => {
          this.setPreload(false);
        })
      },

      listarPlantillas() {
        this.setPreload(true);
        this.$axios.get('/th-tipo-plantillas').then(res => {
          this.plantillas = res.data.filter(item => item.id === parseInt(this.datosEmpleado.th_tipo_plantilla_id))
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        }).finally(() => {
          this.setPreload(false);
        })
      },

      listarEmpleados() {
        this.setPreload(true);
        this.$axios.get('/empleados/jefe-empleados').then(res => {
          this.listaEmpleados = res.data
          this.preload = false
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        }).finally(() => {
          this.setPreload(false);
        })
      },

      consultarDatos() {
        this.setPreload(true);
        this.clearDataEvaluacion()
        const cedula = {
          documento: this.documento
        }
        this.$axios.post('/empleados/datos-empleado-cedula/', cedula).then(res => {
          this.datosEmpleado = res.data
          this.evaluacion.fecha_inical_periodo = res.data.fecha_inicial_periodo
          this.evaluacion.fecha_final_periodo = res.data.fecha_final_periodo
          this.listarPlantillas()
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        }).finally(() => {
          this.setPreload(false);
        })
      },

      plantilla() {
        this.setPreload(true);
        this.$axios.get('/evaluacion-desempeno/plantilla').then(res => {
          this.plantillaEvaluacion = res.data
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        }).finally(() => {
          this.setPreload(false);
        })
      },

      generarEvaluacionDesempeno() {
        this.calcularMesesFechaIngreso()
        if (this.evaluacion.fecha_inical_periodo == null) {
          this.$toast.error('La fecha inicial del periodo es obligatorio')
          return
        }
        if (this.evaluacion.fecha_final_periodo == null) {
          this.$toast.error('La fecha final del periodo es obligatorio')
          return
        }
        if (this.evaluacion.fecha_inical_periodo < "1900-01-01" || this.evaluacion.fecha_final_periodo < "1900-01-01") {
          this.$toast.error('La inicial o final del periodo es inferior a 1900')
          return
        }
        if (this.datosEmpleado.tipo_contrato_id == 4) {
          return this.$swal({
            type: 'error',
            title: "¡No puede ser!",
            text: 'No es posible generar evaluación de desempeño a empleados con contrato de aprendizaje.',
          })
        }
        if (moment(this.evaluacion.fecha_inical_periodo).isBefore(this.datosEmpleado.fecha_ingreso)) {
          return this.$swal({
            type: 'error',
            title: "¡Error de periodo de evaluación!",
            text: 'La fecha inicial del periodo a evaluar no puede ser inferior a la fecha de ingreso del empleado',
          })
        }
        if (this.diferenciaMeses < 3) {
          return this.$swal({
            type: 'error',
            title: "¡No puede ser!",
            text: 'El empleado tiene menos de 3 meses de iniciado su contrato, por ende no se le puede realizar evaluación de desempeño',
          })
        }
        const requets = {
          fecha_inicial_periodo: this.evaluacion.fecha_inical_periodo,
          fecha_final_periodo: this.evaluacion.fecha_final_periodo,
          th_tipo_plantilla_id: this.evaluacion.plantilla_id,
          empleado_id: this.datosEmpleado.id,
        }
        this.preload = true
        this.$axios.post('/evaluacion-desempeno', requets).then(res => {
          this.consultarEvaluciacion(res.data)
          this.$toast.success('Evaluacion de desempeño generada con exito!.')
          this.generarPlantilaAcalificar(this.evaluacion.plantilla_id)
          this.resultadoConsultado = res.data
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        })
      },

      generarPlantilaAcalificar() {
        this.setPreload(true);
        this.$axios.post('/evaluacion-desempeno/miPlantilla/' + this.evaluacion.plantilla_id).then(res => {
          this.miPlantilla = res.data;
          this.miPlantilla[0].pilares.forEach(s => {
            this.calcularValorPilar(s.id)
          })
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        }).finally(() => {
          this.setPreload(false);
        })
      },

      clearDataEvaluacion() {
        this.plantillaEvaluacion = []
      },

      finalizarEvaluacion($id) {
        let suma = 0;
        let claves = Object.keys(this.porcentajePilares)
        for (let i = 0; i < claves.length; i++) {
          let clave = claves[i];
          suma += this.porcentajePilares[clave]
        }
        this.sumaTotal.suma = parseFloat(suma).toFixed(2);
        if (isNaN(this.sumaTotal.suma)) {
          return this.$swal(
            '¡No puede ser!',
            'Es necesario calificar todas las competencias',
            'error'
          )
        }
        this.setPreload(true);
        this.$axios.post('/evaluacion-desempeno/finalizar-evaluacion/' + $id, this.sumaTotal).then(res => {
          this.$toast.success(res.data.mensaje)
          this.resultadoConsultado = ''
          this.evaluacion = {}
          this.datosEmpleado = {}
          this.documento = ''
          this.printEvaluacion($id)
          this.clearDataEvaluacion()
          this.listarEmpleados()
          this.consultarEmpleados()
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        }).finally(() => {
          this.setPreload(false);
        })

      },

      printEvaluacion($id) {
        this.setPreload(true);
        this.$axios({
          method: 'get',
          url: '/evaluacion-desempeno/printfpdf/' + $id,
          responseType: 'arraybuffer',
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/pdf"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.setPreload(false);
        })
      },

      calcularValorPilar(item) {
        let sumaValores = 0;
        const pilar = this.miPlantilla[0].pilares.filter(s => s.id === item);
        let cantidadCompetencias = pilar[0].competencias.length;
        pilar[0].competencias.forEach(s => {
          sumaValores += parseInt(this.radio['competencia' + s.id]);
        })
        const porcentaje = (sumaValores / (cantidadCompetencias * 5) * (parseInt(pilar[0].porcentaje) / 100))
        this.porcentajePilares['pilar' + item] = porcentaje * 100;
      },

      calcularMesesFechaIngreso() {

        var fecha1 = moment(this.datosEmpleado.fecha_ingreso);
        var fecha2 = moment();
        this.diferenciaMeses = (fecha2.diff(fecha1, 'month'));
      },

      getColor(value) {
        return ['red', 'yellow', 'green', 'blue', 'purple'][value - 1];
      },
      getIcon(value) {
        return [
          'mdi-emoticon-cry-outline',
          'mdi-emoticon-confused-outline',
          'mdi-emoticon-neutral-outline',
          'mdi-emoticon-happy-outline',
          'mdi-emoticon-excited-outline',
        ][value - 1];
      },

      getIconOn(value) {
        return [
          'mdi-emoticon-cry',
          'mdi-emoticon-confused',
          'mdi-emoticon-neutral',
          'mdi-emoticon-happy',
          'mdi-emoticon-excited',
        ][value - 1];
      },

    },
  };

</script>

<style lang="scss" scoped>
  /* Estilo personalizado para la tabla */
  .custom-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
    border: 1px solid #ddd;
  }

  .custom-table th {
    background-color: #f4f4f9;
    color: #333;
    font-weight: bold;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  .custom-table td {
    padding: 8px;
    border-bottom: 1px solid #ddd;
    text-align: center;
    position: relative;
    height: 40px;
  }

  .custom-table tr:hover {
    background-color: #f9f9f9;
  }

  /* Estilo para el mapa de calor */
  .heatmap-cell {
    width: 100%;
    height: 100%;
    display: inline-block;
    text-align: center;
    color: white;
  }

  .heatmap-low {
    background-color: #ff6961;
  }

  .heatmap-medium-low {
    background-color: #fdfd96;
  }

  .heatmap-medium {
    background-color: #77dd77;
  }

  .heatmap-medium-high {
    background-color: #03a9f4;
  }

  .heatmap-high {
    background-color: #9c27b0;
  }

  table,
  td,
  th {
    border: 1px solid #595959;
    border-collapse: collapse;
  }

  td,
  th {
    padding: 3px;
    width: 1020px;
    height: 25px;
  }

  th {
    background: #f0e6cc;
  }

  .even {
    background: #fbf8f0;
  }

  .odd {
    background: #fefcf9;
  }

  // tabla
  .tg {
    border-collapse: collapse;
    border-spacing: 0;
  }

  .tg td {
    border-color: black;
    border-style: solid;
    border-width: 1px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    overflow: hidden;
    padding: 3px 7px;
    word-break: normal;
  }

  .tg th {
    border-color: black;
    border-style: solid;
    border-width: 1px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: normal;
    overflow: hidden;
    padding: 3px 7px;
    word-break: normal;
  }

  .tg .tg-mnhx {
    background-color: #fe0000;
    text-align: left;
    vertical-align: top
  }

  .tg .tg-qssw {
    background-color: #f8a102;
    text-align: left;
    vertical-align: top
  }

  .tg .tg-x6nt {
    background-color: #9aff99;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    vertical-align: top
  }

  .tg .tg-1grn {
    font-size: 13px;
    font-style: italic;
    text-align: center;
    vertical-align: top
  }

  .tg .tg-z1yq {
    font-size: 13px;
    text-align: center;
    vertical-align: top
  }

  .tg .tg-s7ni {
    background-color: #f8ff00;
    text-align: left;
    vertical-align: top
  }

  .tg .tg-o79m {
    background-color: #3166ff;
    text-align: left;
    vertical-align: top
  }

  .tg .tg-netp {
    background-color: #036400;
    text-align: left;
    vertical-align: top
  }

  @media screen and (max-width: 767px) {
    .tg {
      width: auto !important;
    }

    .tg col {
      width: auto !important;
    }

    .tg-wrap {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
  }

</style>
