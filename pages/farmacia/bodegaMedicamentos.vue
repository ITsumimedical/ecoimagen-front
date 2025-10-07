<template>
  <div>
    <v-data-table :headers="headers" disable-pagination hide-default-footer dense :items="bodegas" sort-by="id"
      class="elevation-1" :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar">
      <template v-slot:[`item.prueba`]="{ item }">
        <td>
          {{`${item.medicamento.codesumi.codigo} (${item.medicamento.codesumi.nombre}) - ${item.medicamento.cum}` }}
        </td>
      </template>
      <template v-slot:top>
        <v-card-title>

          <!-- Boton de asociacion -->
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            Asociar Producto
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <!-- Buscador de bodegas -->
          <v-col cols="3" sm="3" md="3">
            <v-autocomplete v-model="formularioBodega" label="Bodega" :items="listabodegas" item-text="nombre"
              item-value="id"></v-autocomplete>
          </v-col>

          <!-- buscador de medicamentos -->
          <v-col cols="3" sm="3" md="3">
            <v-autocomplete v-model="formularioMedicamento" :loading="loading" :items="medicamentos"
              item-text="nombreCodesumi" :search-input.sync="medicamento"
              no-data-text="Debe ingresar el nombre del medicamento" item-value="id"
              label="Digita el nombre de medicamento">
            </v-autocomplete>
          </v-col>

          <v-card-actions>
            <v-btn color="error" small
              @click="formularioBodega='',formularioMedicamento='',listarBodegaMedicamento()">
              Limpiar
            </v-btn>
            <v-btn color="info" small @click="listarBodegaMedicamento()">
              filtrar
            </v-btn>
          </v-card-actions>

        </v-card-title>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on" @click="inactivar(item)">
              mdi-list-status
            </v-icon>
          </template>
          <span>{{ item.estado == true ? 'Inactivar' : 'Activar' }}</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.estado`]="{ item }">
        <v-chip small :color="chipsEstado(item.estado)" dark>{{ item.estado == 1 ? 'Activa' : 'Inactiva' }}
        </v-chip>
      </template>
    </v-data-table>

    <!-- asociar medicamentos a bodegas -->
    <v-dialog v-model="dialog" max-width="1000px" persistent>
      <v-card>
        <v-alert dense text border="left" type="info">Asociar un medicamentos a una bodega</v-alert>
        <form @submit.prevent="guardarBodegas">
          <v-card-text>
            <v-container fluid>
              <v-row dense>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete v-model="bodega.bodegas" chips small-chips multiple outlined label="Bodega"
                    :items="listabodegas" item-text="nombre" return-object dense></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete v-model="bodega.medicamento_id" outlined :loading="loading" :items="medicamentos"
                    item-text="nombreCodesumi" :search-input.sync="medicamentoCrear"
                    no-data-text="Debe ingresar el nombre del medicamento" item-value="id"
                    label="Digita el nombre de medicamento" dense>
                  </v-autocomplete>
                </v-col>

              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" small @click="close()">
              Cancelar
            </v-btn>
            <v-btn color="boton" dark small @click="guardarBodegas()">
              Guardar
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>

    <!-- paginacion -->
    <v-row no-gutters>
      <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
          @input="listarBodegaMedicamento()">
        </v-pagination>
      </v-col>
      <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
          @change="listarBodegaMedicamento()">
        </v-select>
      </v-col>
    </v-row>

    <!-- preload -->
    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Procesando Información
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import loadingRequest from '~/plugins/loading-request';

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('farmacia.bodegaMedicamentos')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonBodegas',

    data() {
      return {
        medicamentos: null,
        medicamento: '',
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscar: '',
        bodegas: [],
        listabodegas: [],
        municipio: [],
        tipoBodega: [],
        bodega: {
          bodegas: '',
          medicamento_id: '',
          estado: true
        },
        editedIndex: -1,
        defecto: {
          bodegas: '',
          medicamento_id: '',
        },
        errors: {
          bodegas: '',
          medicamento_id: ''
        },
        paginate: {
          total: 0,
          page: 1
        },

        headers: [{
            text: 'Id',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Bodega',
			sortable: false,
            value: 'bodega.nombre'
          },
          {
            text: 'Medicamento',
			sortable: false,
            value: 'prueba'
          },
          {
             text: 'Estado',
			 sortable: false,
            value: 'estado'
          },
          {
            text: 'Acción',
			sortable: false,
            value: 'actions'
          }
        ],
        pagina: 1,
        total: 0,
        opcionActual: 20,
        opciones: [20, 50, 100],
        formularioBodega: '',
        formularioMedicamento: '',
        medicamentoCrear: ''
      };
    },

    mounted() {
      this.listarBodegas();
      this.listarBodegaMedicamento();
    },



    watch: {

      medicamento(val) {
        if (val) {
          if (val.length === 4) {
            this.listaCodigosHorus2();
          } else if (val.length < 4) {
            this.medicamentos = null;
          }
        } else {
          this.medicamentos = null;

        }
      },


      medicamentoCrear(val) {
        console.log(val)
        if (val) {
          if (val.length === 4) {
            this.listaCodigosHorus();
          } else if (val.length < 4) {
            this.medicamentos = null;
          }
        } else {
          this.medicamentos = null;

        }
      }
    },

    methods: {

      listaCodigosHorus() {
        this.loading = true;
        this.$axios.post('/medicamentos/buscar', {
          nombre: this.medicamentoCrear
        }).then(res => {
          this.medicamentos = res.data.map(item => ({
            ...item,
            nombreCodesumi: `${item.codesumi.nombre} - ${item.cum}`
          }));
          this.loading = false;
        }).catch(e => {
          console.error(e.response);
          this.loading = false;
        });
      },

      listaCodigosHorus2() {
        this.loading = true;
        this.$axios.post('/medicamentos/buscar', {
          nombre: this.medicamento
        }).then(res => {
          this.medicamentos = res.data.map(item => ({
            ...item,
            nombreCodesumi: `${item.codesumi.nombre} - ${item.codesumi.codigo} - ${item.cum}`
          }));
          this.loading = false;
        }).catch(e => {
          console.error(e.response);
          this.loading = false;
        });
      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.bodega = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },

      listarBodegaMedicamento() {
        this.preload = true
        this.$axios.post('/bodega-medicamentos/listar?page=' + this.pagina + '&cantidad=' + this.opcionActual, {
          bodega: this.formularioBodega,
          medicamento: this.formularioMedicamento
        }).then(res => {
          this.bodegas = res.data.data
          this.total = res.data.last_page
          this.preload = false
        }).catch(e => {
          console.log(e.response)
          this.preload = false
        })
      },



      async guardarBodegas() {

        this.bodega.cantidad_total = 0;
        try {
          this.preload = true;
          const res = await this.$axios.post('/bodega-medicamentos/guardar', this.bodega);
          const mensajes = res.data;

          this.preload = false;

          // Iterar sobre los mensajes y mostrarlos
          mensajes.forEach(mensaje => {
            if (mensaje.mensaje.includes('éxito')) {
              this.$toast.success(mensaje.mensaje);
            } else {
              this.$toast.error(mensaje.mensaje);
            }
          });

          // Asumiendo que si hay al menos un mensaje de éxito, cerramos el diálogo
          if (mensajes.some(mensaje => mensaje.mensaje.includes('éxito'))) {
            this.preload = false;
            this.listarBodegaMedicamento();
            this.close();
          }
        } catch (error) {
          this.preload = false;
          if (error.response && error.response.data) {
            const errores = error.response.data;
            errores.forEach(error => {
              this.$toast.error(error.mensaje);
            });
          }
        }
      },

      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      listarBodegas() {
        this.$axios.get('/bodegas/listar').then(res => {
          this.listabodegas = res.data
        }).catch(e => {
          console.log(e.response)
        })
      },

      inactivar(item) {
        console.log('ddd', item);

        this.$swal({
          title: "¿Está Seguro?",
          text: "Inactivar bodega",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
        }).then(async (result) => {
          if (result.value) {
            const data = {
              id: item.id,
              estado: item.estado == 1 ? 0 : 1,
            }
            this.$axios.post('/bodega-medicamentos/inactivar', data).then((res) => {
                this.$toast.success('Aciión con exito.')
                this.listarBodegaMedicamento()
              })
              .catch((e) => {
                console.log(e);
              });
          }

        });
      },
      chipsEstado(estado) {
        if (estado == 1) return 'success'
        else if (estado == 0) return 'error'
        else return 'warning'
      },
    },
  };

</script>
