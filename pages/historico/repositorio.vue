<template>
  <div>
    <!-- preload -->
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

    <v-card>
      <v-alert prominent border="left" class="text-center" dense text type="info" icon="mdi-book-open-page-variant">
        <b>HISTORICO DE
          HISTORIAS CLINICAS</b>
      </v-alert>
      <v-container>
        <v-row dense>
          <v-col cols="12" sm="12" md="9">
            <v-text-field v-model="documento" dense outlined label="Número de identificación" clearable
              hide-spin-buttons @click:clear="limpiar()" autofocus></v-text-field>
          </v-col>
          <v-col>
            <v-btn color="primary" small @click="buscarAtenciones" @keyup.enter="buscarAtenciones" type="submit">Buscar
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table :headers="headers" :items="historicoConsultas" :loading="loadingTable" disable-pagination
        v-if="historicoConsultas" loading-text="Cargando... por favor espere" hide-default-footer>
        <template v-slot:[`item.acciones`]="{ item }">
          <div class="text-center">
            <v-tooltip bottom v-if="item.finalidad !='Cargue historia contingencia'">
              <template v-slot:activator="{ on }">
                <v-btn class="mx-2" fab dark x-small color="blue" v-on="on" @click="imprimir(item,'historia_base')">
                  <v-icon dark>mdi-download</v-icon>
                </v-btn>
              </template>
              <span>Descargar Historia</span>
            </v-tooltip>
            <v-tooltip bottom v-else>
              <template v-slot:activator="{ on }">
                <v-btn class="mx-2" fab dark x-small color="success" v-on="on"
                  @click="imprimirAdjunto(item.cargue_historia_contingencia.ruta)">
                  <v-icon dark>mdi-download</v-icon>
                </v-btn>
              </template>
              <span>Descargar Historia</span>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>

      <v-row no-gutters v-if="historicoConsultas">
        <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
          <v-pagination v-model="paginaOrden" class="my-4" :length="totalOrden" :total-visible="9"
            @input="buscarAtenciones"></v-pagination>
        </v-col>
        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
          <v-select class="my-4" v-model="opcionActualOrden" :items="opcionesOrden" dense solo small
            @change="buscarAtenciones"></v-select>
        </v-col>
      </v-row>

    </v-card>
  </div>
</template>
<script>
  import moment from "moment";
  import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('historico.atenciones.consultas')) {
        return redirect('/');
      }
    },

    name: "historicoConsultas",
    components: {
      AfiliadoComponent,
    },
    data: () => ({
      tipo: {

      },
      fecha_proceso: '',
      listaAnexos: '',
      cedula_paciente: '',
      dialgoTipoArchivo: false,
      dialogoCargue: false,
      preload: false,
      loadingTable: false,
      documento: null,
      historicoConsultas: null,
      headers: [{
          text: 'F.Atención',
          align: 'center',
          sortable: false,
          value: 'Datetimeingreso',
        },
        {
          text: 'Afiliado',
          align: 'center',
          sortable: false,
          value: 'Nombre',
        },
        {
          text: 'Atendido Por',
          align: 'center',
          sortable: false,
          value: 'Atendido_Por',
        },
        {
          text: 'Atencion',
          align: 'center',
          sortable: false,
          value: 'Actividad',
        },
        {
          text: 'Destino Afiliado',
          align: 'center',
          sortable: false,
          value: 'Destinopaciente',
        },
        {
          text: 'Acciones',
          align: 'center',
          sortable: false,
          value: 'acciones',
        }
      ],
      paginaOrden: 1,
      totalOrden: 0,
      opcionesOrden: [10, 20, 50, 100],
      opcionActualOrden: 10,
      tipoArchivo: [],
      datosPaciente: null,
    }),
    methods: {
      async buscarAtenciones() {
        this.loadingTable = true;
        this.preload = true;
        const request = {
          'Num_Doc': this.documento,
          'page': this.paginaOrden,
          'per_page': this.opcionActualOrden,
        };
        await this.$axios.post('/historia/repositorioHistorias', request).then(res => {
          this.historicoConsultas = res.data.data;
          this.totalOrden = Math.ceil(res.data.total / this.opcionActualOrden);
          this.loadingTable = false;
          this.preload = false;
        }).catch(e => {
          this.preload = false;
          this.loadingTable = false;
        });
      },

      imprimir(item, tipo) {
        this.preload = true;
        const data = {
          tipo: tipo,
          consulta: item
        }
        this.$axios.post('pdf', data, {
          responseType: "arraybuffer"
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/pdf"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
          this.preload = false;
        });
      },
      limpiar() {
        this.documento = '',
          this.historicoConsultas = null
      },
      cargueHistorias() {
        this.listarTipoArchivo()
        this.dialogoCargue = true

      },

      limpiarTipoArchivo() {
        for (const key in this.tipo) {
          this.tipo[key] = ''
        }
        this.dialgoTipoArchivo = false
      },

      listarTipoArchivo() {
        this.preload = true
        this.$axios.get('/tipo-archivo/listar').then(res => {
          this.tipoArchivo = res.data;
          this.preload = false;
        }).catch(e => {
          this.preload = false;

        })
      },

      guardarTipoArchivo() {
        this.preload = true
        this.$axios.post('/tipo-archivo/crear', this.tipo).then(res => {
          this.limpiarTipoArchivo()
          this.listarTipoArchivo()
          this.preload = false;
        }).catch(e => {
          this.preload = false;
        })
      },

      buscarAfiliado() {
        this.preload = true;
        this.$axios.get('afiliados/' + this.cedula_paciente).then(res => {
            this.preload = false;
            this.datosPaciente = res.data
          })
          .catch(e => {
            this.$toast.error('El afiliado no se encuentra en la base de datos');
            this.preload = false;
          });
      },

      clearFields() {
        this.cedula_paciente = '',
          this.listaAnexos = '',
          this.fecha_proceso = '',
          this.datosPaciente = null,
          this.dialogoCargue = false
      },

      guardar() {
        if (this.$refs.adjuntos.files == '') {
          this.$toast.error("El anexo es requerido");
          return;
        }
        // if (this.adjuntos.length > 1) {
        //   swal({
        //     title: "¡No puede adjuntar más de 3 archivos!",
        //     text: ` `,
        //     timer: 2000,
        //     icon: "error",
        //     buttons: false
        //   });
        //   return
        // }
        let fecha = moment(new Date()).format('YYYY-MM-D HH:mm')
        let formData = new FormData();
        formData.append('tipo_archivo_id', this.listaAnexos)
        formData.append('afiliado_id', this.datosPaciente.id)
        formData.append('fecha_hora_inicio', fecha)
        formData.append('fecha_proceso', this.fecha_proceso)
        formData.append(`adjuntos`, this.$refs.adjuntos.files[0]);
        this.$axios.post('/cargue-historia-contingencia/crear', formData).then(res => {
          this.clearFields()
          this.preload = false;
        }).catch(e => {
          this.preload = false;
        })
      },

      async imprimirAdjunto(ruta) {
        try {
          this.preload = true;
          let adj = await this.$adjuntos(ruta);
          let blob = new Blob([adj[1]], {
            type: adj[0],
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
          this.preload = false;
        } catch (error) {
          this.preload = false;
          this.$toast.error('El adjunto de la factura no existe!')
          console.log(error.response);

        }
      },
    }
  }

</script>
