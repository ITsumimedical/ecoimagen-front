<template>
  <div>
    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Tranquilo procesamos tu solicitud !
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card flat>
      <v-card-title>
        <!-- afiliado -->
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field dense v-model="cedula_paciente" label="Buscar Afiliado Por Documento"
                append-icon="mdi-magnify" hide-details single-line v-on:keyup.enter="buscar_afiliado(cedula_paciente)"
                outlined>
              </v-text-field>
            </v-col>
            <!-- Buscar afiliado -->
            <v-card-actions class="pb-9">
              <v-btn color="info" small dark @click="buscar_afiliado(cedula_paciente)">Buscar Afiliado</v-btn>
              <v-btn color="warning" small dark class="ma-2" @click="reporte = true">Descargar Reporte<v-icon right
                  dark>
                  mdi-arrow-down-bold-circle
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-row>
        </v-container>
      </v-card-title>
    </v-card>
    <!-- Dialogo para descargar el reporte de Asistencia educativa -->
    <v-dialog v-model="reporte" width="700" persistent>
      <v-card>
        <v-col>
          <v-alert type="info" dense text outlined icon="mdi-arrow-down-bold-circle"><b>Asistencias
              Educativas</b></v-alert>
        </v-col>
        <v-form @submit.prevent="exportarRegistro()">
          <v-card-text style="color: black">
            <v-container>
              <v-layout row wrap>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field dense v-model="afiliados.fechaInicial" label="Fecha inicial del reporte" type="date">
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field dense v-model="afiliados.fechaFinal" label="Fecha final del reporte" type="date">
                  </v-text-field>
                </v-col>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-form>
        <v-layout>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-btn color="red" dark @click="LimpiarReporte()" small>Cerrar</v-btn>
            <v-btn color="success" dark @click="exportarRegistro()" small>Descargar<v-icon right dark>
                mdi-arrow-down-bold-circle
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-layout>
      </v-card>
    </v-dialog>
    <!-- fin del dialogo -->

    <!-- generar asistencia -->
    <v-card flat v-if="mostrarDatos">
      <v-card-text>
        <v-card-text :loading="loading" :disabled="loading">
          <component :is="componente" :datos="datos" :datosBasicos="true" :camposNoEditables="true"
            @respuestaComponente="limpiarComponente()" />
        </v-card-text>
        <v-col cols="12" sm="6" md="12">
          <v-alert border="left" dense text outlined color="blue" icon="mdi-school-outline"><b>Generar Asistencia
              Educativa</b>
          </v-alert>
        </v-col>
        <v-form>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-col cols="12" sm="6" md="3">
                <v-text-field outlined dense v-model="afiliados.fecha" label="Fecha" type="date" v-if="mostrarDatos"
                  :error-messages="errors.fecha">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-autocomplete outlined dense v-model="afiliados.cup_id" :search-input.sync="FiltroCups" :items="cups"
                  item-text="cups" item-value="id" no-data-text="Debe ingresar el nombre del procedimiento"
                  return-object label="Elige el cup asociado" :error-messages="errors.cup_id">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field dense v-model="afiliados.tema" label="Tema" v-if="mostrarDatos"
                  :error-messages="errors.tema">
                </v-text-field>
              </v-col>
            </v-layout>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" dark v-if="mostrarDatos" small @click="limpiarComponente()">Cerrar</v-btn>
              <v-btn color="success" v-if="mostrarDatos" small @click="generarAsistencia()">Guardar registro</v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
    <!-- fin -->
  </div>
</template>

<script>
  import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: "afiliadoPadre",
    components: {
      AfiliadoComponent,
    },

    data() {
      return {
        cedula_paciente: '',
        tiposDocumentos: [],
        tipo_documento: [],
        asegurador: [],
        asistencia: false,
        preload: false,
        loading: false,
        reporte: false,
        dialog: false,
        datos: [],
        cups: null,
        FiltroCups: null,
        asistencia: [],
        buscar: '',
        tab: null,
        mostrarTabla: false,
        componente: false,
        afiliados: {
          fecha: '',
          tipo_documento: '',
          numero_documento: '',
          primer_nombre: '',
          segundo_nombre: '',
          primer_apellido: '',
          segundo_apellido: '',
          edad_cumplida: '',
          asegurador_id: '',
          entidad_id: '',
          cup_id: '',
          tema: '',
          afiliado_id: ''
        },
        errors: {
          tipo_documento: null,
          numero_documento: '',
          primer_nombre: null,
          segundo_nombre: null,
          primer_apellido: null,
          segundo_apellido: null,
          edad_cumplida: null,
          asegurador_id: null,
          entidad_id: null,
          cup_id: null,
          tema: null,
          fecha: null,
          afiliado_id: null
        },
        headers: [{
            text: 'Id',
            value: 'id'
          },
          {
            text: 'Fecha Creacion',
            value: 'fecha'
          },
          {
            text: 'Afiliado',
            value: 'NombreAfiliado'
          },
          {
            text: 'Numero Documento',
            value: 'Cedula'
          },
          {
            text: 'Tema',
            value: 'tema'
          },
          {
            text: 'Cup',
            value: 'Nombre_cups'
          },
          {
            text: 'Usuario Que Registra',
            value: 'nombre_completo'
          },
        ],
        fechaInicial: '',
        fechaFinal: '',
        mostrarDatos: false,
      }
    },
    watch: {
      FiltroCups(val) {
        if (val) {
          if (val.length === 4) {
            this.listaCups();
          } else if (val.length < 4) {
            this.cups = null;
          }
        } else {
          this.cups = null;

        }
      }
    },
    methods: {

      //Busca el afiliado por medio de la cedula
      buscar_afiliado() {
        if (!this.cedula_paciente) {
          this.$toast.error('Por favor introduce la cédula del afiliado.');
          return;
        }
        this.preload = true;
        this.$axios
          .get('/afiliados/' + this.cedula_paciente)
          .then((res) => {
            this.componente = "AfiliadoComponent";
            this.componenteAfiliado = true;
            this.datos = res.data;
            this.mostrarDatos = true;
            this.preload = false;
            this.asistencia = false;
          })
          .catch((e) => {
            this.preload = false;
            this.asistencia = false;
            this.$toast.error(e.response.data.error);
          });
      },

      //Funcion para limpiar el componente
      limpiarComponente() {
        this.componente = true;
        this.datos = {};
        this.mostrarDatos = false;
        this.cedula_paciente = '';
        this.afiliados = {
          fecha: '',
          cup_id: '',
          tema: '',
        };
        this.errors = {
          fecha: '',
          cup_id: '',
          tema: '',
        }
      },

      abrirDialogo() {
        this.dialog = true;
      },

      cerrarDialogo() {
        this.dialog = false;
      },

      // Funcion para listar los cups
      listaCups() {
        this.preload = true;
        this.$axios.post('/cup/buscarCupsNombre', {
          nombre: this.FiltroCups
        }).then(res => {
          this.cups = res.data
          this.preload = false;
        }).catch(e => {
          e.response
          this.preload = false;
        })
      },

      //Funcion para guardar una asistencia educativa
      generarAsistencia() {
        this.afiliados['afiliado_id'] = this.datos.id;
        this.afiliados['cup_id'] = this.afiliados.cup_id.id;
        this.$axios
          .post('/asistencia-educativas/crear', this.afiliados)
          .then((res) => {
            this.$toast.success('Asistencia Educativa Creada Con Éxito!');
            this.limpiarComponente();
          })
          .catch(e => {
            this.$toast.error('Error Al Crear La Asistencia Educativa');
            if (!this.afiliados.fecha || !this.afiliados.cup_id || !this.afiliados.tema) {
              this.errors.fecha = !this.afiliados.fecha ? '¡Campo de fecha requerido!' : null;
              this.errors.cup_id = !this.afiliados.cup_id ? '¡Seleccione un tipo de educación!' : null;
              this.errors.tema = !this.afiliados.tema ? '¡El campo de tema es requerido!' : null;
              return;
            }
          });
      },

      // //Funcion para exportar excel, verifica si seleccionaron las fechas y va a la ruta del controlador  a verificar si en ese rango de fechas hay datos disponibles para descargar
      exportarRegistro() {
        if (!this.afiliados.fechaInicial || !this.afiliados.fechaFinal) {
          this.$toast.error('Por favor, seleccione ambas fechas para generar el reporte.');
          return;
        }
        this.$axios.get('/asistencia-educativas/verificarDatos', {
          params: {
            fechaInicial: this.afiliados.fechaInicial,
            fechaFinal: this.afiliados.fechaFinal
          }
        }).then(res => {
          if (res.status === 204) {
            this.$toast.error('No hay datos disponibles para descargar en el rango de fechas seleccionado.');
          } else if (res.status === 200) {
            this.descargarRegistro();
            this.$toast.success('La descarga se ha realizado con éxito!');
          }
        })

      },
      descargarRegistro() {
        // Llamada al backend para descargar el archivo con las fechas seleccionadas
        this.$axios.post('/asistencia-educativas/reporteAsistencia', {
          fechaInicial: this.afiliados.fechaInicial,
          fechaFinal: this.afiliados.fechaFinal
        }, {
          responseType: 'blob' // Para recibir el archivo como un blob
        }).then(response => {
          let url = window.URL.createObjectURL(new Blob([response.data]));
          let link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'ReporteAsistencias.xls');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }).catch(error => {
          console.error(error);
        });
      },
      LimpiarReporte() {
        this.reporte = false;
        this.afiliados = {
          fechaInicial: '',
          fechaFinal: ''
        }
      }

    }
  }

</script>
