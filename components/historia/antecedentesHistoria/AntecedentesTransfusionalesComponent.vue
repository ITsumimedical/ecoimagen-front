<template>
  <div>
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
    <v-card elevation="0">
      <v-form>
        <v-container fluid>
          <v-alert class="text-center" dense text border="left" type="info" icon="mdi-transit-connection-variant">
            <b>ANTECEDENTES TRANSFUSIONALES</b></v-alert>
          <v-row dense>
            <!-- <pre>{{Object.keys(resumen).length}}</pre> -->
            <!-- <v-col cols="12" sm="6" md="3">
              <v-autocomplete :items="tipoTransfusion" label="Tipo de transfusiones" v-model="antecedentesTransfusionales.tipo_transfusion" dense
                outlined solo>
              </v-autocomplete>
            </v-col> -->

            <!-- fecha -->
            <v-col cols="12" sm="6" md="3">
              <v-text-field type="date" v-model="antecedentesTransfusionales.fecha_transfusion"
                label="Fecha transfusion" dense outlined ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="8">
              <v-textarea auto-grow name="input-7-1" dense outlined v-model="antecedentesTransfusionales.causa" label="Causa"
                rows="1">
              </v-textarea>
            </v-col>

            <v-col cols="12" sm="6" md="1">
              <v-btn color="boton" class="mt-2"  small dark @click="guardar()">Agregar</v-btn>
            </v-col>
            <!-- Campos de textarea -->


            <!-- <v-row align="center" justify="space-around">
              <v-btn tile color="success" class="mt-2" @click="guardar()">
                Guardar
              </v-btn>
            </v-row> -->
            <v-col cols="12" sm="12" md="12">
              <v-alert icon="mdi-history" dense text border="left" type="info" color="blue-grey" class="text-center"> <b>Historico de
                  Transfusiones</b> </v-alert>
              <v-data-table :headers="headersHistorico" :items="antecedentes" :loading="loading" dense
                class="elevation-1 mt-4" hide-default-footer disable-pagination no-data-text="Sin datos para mostrar">
                <template v-slot:[`item.acciones`]="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                        @click="eliminarAntecedente(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Eliminar</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>

  </div>
</template>

<script>
export default {
  name: 'WorkspaceJsonAntecedentesPersonalesComponent',
  props: {
    datos: Object,
    ocupacional: Array,
    resumen: Object
  },
  created() {
    this.antecedentesTransfusionales.consulta_id = this.datos.id;
    if (this.ocupacional !== undefined) {
      this.antecedentesTransfusionales.consulta_id = this.ocupacional[0].id_CONSULTA
    }
  },
  data() {
    return {
      loading: false,
      preload: false,
      antecedentes: [],
      antecedentesTransfusionales: {
        tipo_transfusion: null,
        fecha_transfusion: null,
        causa: null,
      },
      tipoTransfusion: ['Transfusión alogénica', 'Transfusión autóloga'],
      antecedentesPreingresados: [],
      headers: [
        // {
        //   text: 'Tipo transfusion',
        //   value: 'tipo_transfusion'
        // },
        {
          text: 'Fecha transfusion',
          value: 'fecha_transfusion'
        },
        {
          text: 'Causa',
          value: 'causa'
        },
        {
          text: 'Eliminar',
          value: 'eliminar'
        },
      ],
      headersHistorico: [
        // {
        //   text: 'Tipo transfusion',
        //   value: 'tipo_transfusion'
        // },
        {
          text: 'Fecha transfusion',
          value: 'fecha_transfusion'
        },
        {
          text: 'Causa',
          value: 'causa'
        },
        {
          text: "Registrado por",
          value: "user.operador.nombre",
        },
        {
          text: 'Fecha registro',
          value: 'created_at'
        },
        {
          text: 'Acciones',
          value: 'acciones',
          sortable: false,
          align: 'center',
        }
      ],
    };
  },

  created() {
    // // this.listar();
    // if (Object.keys(this.resumen).length > 0) {
    //   this.antecedentes = this.resumen.consulta.antecedente_transfucionales
    // } else {
    //   this.antecedentes = []
    // }

  },

  methods: {

    guardar() {
      //   if (this.antecedentesTransfusionales.tipo_transfusion == null) {
      //   return this.$toast.error('Debe seleccionar un tipo de transfusion')
      // }
      this.antecedentesTransfusionales.consulta_id = this.datos.id;
      if (this.ocupacional !== undefined) {
        this.antecedentesTransfusionales.consulta_id = this.ocupacional[0].id_CONSULTA;
      }
      this.antecedentesTransfusionales.tipo_transfusion = '1'
      this.preload = true
      this.$axios.post('/antecedentes-transfusionales/guardar', this.antecedentesTransfusionales)
        .then((res) => {
          this.$toast.success(res.data.mensaje)
          this.limpiarFiltro();

        }).catch((err) => {
          console.log(err);
          // return this.$toast.error('No hay antecedentes pre-guardados para almacenar');
          this.$toast.error("Ocurrió un error al intentar guardar los antecedentes transfusionales");
        }).finally(() => {
          this.preload = false
        })
    },
    listar() {
      let data = {}
      data.afiliado = this.datos.afiliado_id;
      if (this.ocupacional !== undefined) {
        data.afiliado = this.ocupacional[0].afiliado_id
      }
      this.loading = true
      this.$axios.post('/antecedentes-transfusionales/listar', { afiliado: data.afiliado }).then(res => {
        this.antecedentes = res.data;
      }).catch((err) => {
        return this.$toast.error('Error al listar antecedentes personales');
      }).finally(() => {
        this.loading = false
      })
    },
    limpiarFiltro() {
      for (const prop of Object.getOwnPropertyNames(this.antecedentesTransfusionales)) {
        this.antecedentesTransfusionales[prop] = null;
      }
      this.listar();
    },
    validarErrores() {
      return [];
    },

    eliminarAntecedente(item) {
      this.$swal({
        title: '¿Está Seguro?',
        text: `Está a punto de eliminar el antecedente ${item.causa}`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          this.preload = true;
          this.$axios
            .delete(`/antecedentes-transfusionales/eliminar/${item.id}`)
            .then((res) => {
              this.$toast.success(res.data.mensaje);
              this.listar();
            })
            .catch((err) => {
              return this.$toast.error('Error al eliminar antecedente transfusional');
            }).finally(() => {
              this.preload = false;
            })
        }
      })
    }
  },
};

</script>

<style lang="scss" scoped></style>
