<template>
  <div>
    <!-- CARGUE RIPS -->
    <v-card>
      <v-form>
        <v-container>
          <v-alert color="blue-grey" border="left" icon="mdi-cloud-arrow-up" text dense type="info">Cargue de archivos
            <b>RIPS</b></v-alert>
          <v-row>
            <v-col cols="8" sm="8" md="4">
              <v-autocomplete dense v-model="rips.tipo_archivo" :items="tiposArchivosItems" item-text="nombre"
                item-value="id" label="Tipo de archivo*">
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-file-input show-size outlined dense label="Adjuntar" v-model="adjuntos" accept="text/plain" />
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn disabled small color="boton" dark @click="ejecutarProcedimiento()">
              Cargar
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
    <v-banner></v-banner>
    <!-- CARGUE AFILIADOS -->
    <v-card>
      <v-form>
        <v-container>
          <v-alert color="indigo" icon="mdi-account-arrow-up" border="left" text dense type="info">Cargue de
            <b>AFILIADOS</b> con la plantilla de <b>HOSVITAL</b></v-alert>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-file-input accept=".csv" outlined dense label="Adjuntar">
              </v-file-input>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="boton" dark @click="descargarFias()">
              Cargar
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
    <v-banner></v-banner>
    <!-- DESCARGA FIAS -->
    <v-card>
      <v-form>
        <v-container>
          <v-alert border="left" color="success" icon="mdi-cloud-arrow-down" text dense type="info">Descarga de
            <b>FIAS</b></v-alert>
          <v-row>
            <v-col cols="8" sm="8" md="8">
              <v-autocomplete dense v-model="fias.tipo_fias" :items="tiposFiasItems" item-text="nombre" item-value="id"
                label="Tipo de FIAS*">
              </v-autocomplete>
            </v-col>
            <v-col cols="2" sm="2" md="2">
              <v-autocomplete dense v-model="fias.mes" :items="mesesItems" item-text="nombre" item-value="id"
                label="Mes*">
              </v-autocomplete>
            </v-col>
            <v-col cols="2" sm="2" md="2">
              <v-autocomplete dense v-model="fias.anio" :items="anioItems" item-text="nombre" item-value="id"
                label="Año*">
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="boton" dark @click="descargarFias()">
              Descargar
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </div>
</template>

<script>
  import {
    actualizacionMasiva
  } from "@/api/afiliados/afiliados";
  export default {
    name: 'WorkspaceJsonDescargaFias',
    created() {
      const year = new Date();
      this.anioItems = [
        year.getFullYear(),
        year.getFullYear() - 1,
        year.getFullYear() - 2,
        year.getFullYear() - 3,
        year.getFullYear() - 4,
        year.getFullYear() - 5
      ]
    },
    data() {
      return {
        adjuntos: [],
        preload: false,
        rips: {
          tipo_archivo: '',
        },
        tiposArchivosItems: [{
          nombre: 'AC',
        }, {
          nombre: 'AH',
        }, {
          nombre: 'AU',
        }],
        fias: {
          tipo_fias: '',
          mes: '',
          anio: '',
        },
        tiposFiasItems: [{
            nombre: "FIAS No. 2A - MORBILIDAD DE LA POBLACION GENERAL DEL MAGISTERIO POR GRUPOS ETARIOS POR AMBITO AMBULATORIO",
            id: 'F2A',
          },
          {
            nombre: "FIAS No. 2B - MORBILIDAD DE LA POBLACION GENERAL DEL MAGISTERIO POR GRUPOS ETARIOS POR AMBITO HOSPITALARIO",
            id: 'F2B',
          },
          {
            nombre: "FIAS No. 2C - MORBILIDAD DE LA POBLACION GENERAL DEL MAGISTERIO POR GRUPOS ETARIOS POR AMBITO DE URGENCIAS",
            id: 'F2C',
          },
          {
            nombre: "FIAS No. 2D - MORBILIDAD DE LA POBLACION GENERAL DEL MAGISTERIO POR GRUPOS ETARIOS POR AMBITO DOMICILIARIO",
            id: 'F2D',
          },
          {
            nombre: "FIAS No. 3 - MORTALIDAD DE LA POBLACION TOTAL DEL MAGISTERIO POR CICLO DE VIDA",
            id: 'F3',
          },
          {
            nombre: "FIAS No. 14 - CONSULTAS POR ÁMBITO DE ATENCIÓN",
            id: 'F14',
          },
        ],
        mesesItems: [{
            id: 1,
            nombre: 'Enero'
          },
          {
            id: 2,
            nombre: 'Febrero'
          },
          {
            id: 3,
            nombre: 'Marzo'
          },
          {
            id: 4,
            nombre: 'Abril'
          },
          {
            id: 5,
            nombre: 'Mayo'
          },
          {
            id: 6,
            nombre: 'Junio'
          },
          {
            id: 7,
            nombre: 'Julio'
          },
          {
            id: 8,
            nombre: 'Agosto'
          },
          {
            id: 9,
            nombre: 'Septiembre'
          },
          {
            id: 10,
            nombre: 'Octubre'
          },
          {
            id: 11,
            nombre: 'Noviembre'
          },
          {
            id: 12,
            nombre: 'Diciembre'
          },
        ],
        anioItems: null,
      };
    },

    mounted() {

    },

    methods: {

      descargarFias() {
        if (this.fias.tipo_fias == '' || this.fias.mes == '' || this.fias.anio == '') {
          return this.$swal({
            title: "¡No puede ser!",
            text: "Debe determinar un tipo, mes y año para poder realizar la descarga",
            type: "error",
          });
        }
        this.$axios.post('/descarga-fias/descargar', this.fias).then(res => {
          const blob = new Blob([res.data], {
            type: "text/plain"
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          const regex = /-/gi;
          a.download = this.fias.tipo_fias + '.TXT'
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }).catch(error => {
          console.log(error);
        })
      },

      async ejecutarProcedimiento() {
        this.loading = true;
        if (!this.adjuntos) {
          this.$toast.error("El archivo es requerido");
          return;
        }
        try {
          const formData = new FormData();
          formData.append(`adjunto`, this.adjuntos);
          const {
            data
          } = await this.$loadingPostRequest(
            actualizacionMasiva(),
            formData
          );
          this.$toast.success("Actualizacion realizada con exito!");
          this.loading = false;
          this.cerrarDialogDescarga();
        } catch (error) {
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje);
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data);
          }
        }
      },

      cerrarDialogDescarga() {
        (this.adjuntos = []);
      },

    }

  }

</script>
