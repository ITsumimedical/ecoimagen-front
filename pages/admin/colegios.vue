<template>

  <v-card>
    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
            <span>Colegios</span>
          </div>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn tile color="success" small @click="modalColegio = true">
          Nuevo colegio
          <v-icon right>
            mdi-plus-circle
          </v-icon>
        </v-btn>
      </v-toolbar>
    </v-card-title>

    <v-data-table :headers="headers" :items="colegios" dense :search="search" hide-default-footer :items-per-page="opcionActual" :loading="cargando">

      <template v-slot:top>
        <v-toolbar flat>
          <v-row>
            <v-col md="3" lg="5" xl="5" sm="3" cols>
              <v-text-field dense v-model="colegio" outlined label="Buscar por nombre" single-line>
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field label="Buscar por codigo dane" outlined dense v-model="codigoDane"></v-text-field>
            </v-col>
            <v-col>
              <v-btn color="success" small @click="listarColegio()" :loading="cargando">Filtrar</v-btn>
              <v-btn color="red" small dark @click="limpiarFiltros()">Limpiar</v-btn>
            </v-col>
          </v-row>
        </v-toolbar>
      </template>

      <template v-slot:[`item.estado`]="{ item }">
        <v-chip small :color="chipsEstado(item.estado)" dark>{{ item.estado == 1 ? 'Activa' : 'Inactiva' }}
        </v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on" @click="inactivarColegio(item)">
              mdi-list-status
            </v-icon>
          </template>
          <span>{{ item.estado == true ? 'Inactivar' : 'Activar' }}</span>
        </v-tooltip>
      </template>

    </v-data-table>

    <v-row no-gutters style="background-color: white;">
      <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listarColegio">
        </v-pagination>
      </v-col>
      <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense outlined small @change="listarColegio()">
        </v-select>
      </v-col>
    </v-row>

    <v-dialog v-model="modalColegio" persistent max-width="800px">
      <v-card>
        <v-alert icon="mdi-town-hall" dense border="left" text type="info">Registrar nuevo colegio</v-alert>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field :error-messages="errors.nombre" label="Nombre" dense v-model="formColegio.nombre">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :error-messages="errors.codigo_dane_colegio" label="Codigo dane" dense
                  v-model="formColegio.codigo_dane_colegio"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-autocomplete :error-messages="errors.municipio_id" label="Municipio" dense
                  v-model="formColegio.municipio_id" :items="municipios" item-text="nombre" item-value="id">
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" small @click="cerrarModal()">
            Cancelar
          </v-btn>
          <v-btn color="success" small @click="registrarColegio()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>

</template>

<script>
  import {
    mapActions
  } from 'vuex';

  export default {
    name: 'FrontHorusColegios',

    data() {
      return {
        search: '',
        modalColegio: false,
        colegios: [],
        municipios: [],
        pagina: 1,
        total: 0,
        opcionActual: 5,
        colegio: '',
        codigoDane: '',
        cargando: false,
        opciones: [5, 10, 20, 50, 100],
        formColegio: {
          nombre: '',
          codigo_dane_colegio: '',
          municipio_id: ''
        },
        errors: {
          nombre: '',
          codigo_dane_colegio: '',
          municipio_id: ''
        },
        editedIndex: -1,
        headers: [{
            text: 'Id',
            align: 'start',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Nombre',
            align: 'start',
            sortable: false,
            value: 'nombre',
          },
          {
            text: 'Codigo dane',
            value: 'codigo_dane_colegio'
          },
          {
            text: 'Municipio',
            value: 'municipio',
          },
          {
            text: 'Estado',
            value: 'estado',
            align: 'center',
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false,
            align: 'center',
          },
        ],
      };
    },

    created() {
      this.fecthmunicipios()
      this.listarColegio()
    },

    methods: {
      ...mapActions('app', ['setPreload']),

      fecthmunicipios() {
        this.$axios.get('/municipios/listar').then((res) => {
            this.municipios = res.data;
          })
          .catch((error) => {});
      },

      registrarColegio() {
        this.limpiarError()
        this.$axios.post('/colegios/crear', this.formColegio).then(res => {
          this.$toast.success(res.data.mensaje)
          this.limpiarFormColegio()
          this.listarColegio()
          this.modalColegio = false
        }).catch(error => {
          if (error.response.data.error) {
            this.$toast.error(error.response.data.error)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        });

      },

      limpiarFormColegio() {
        for (const key in this.formColegio) {
          this.formColegio[key] = ''
        }
      },

      cerrarModal() {
        this.limpiarFormColegio()
        this.modalColegio = false
        this, this.limpiarError()
      },

      async listarColegio() {
        try {
          const params = {
            page: this.pagina,
            cantidad: this.opcionActual,
            nombre: this.colegio,
            codigo: this.codigoDane
        };
        this.cargando = true;
          const response = await this.$axios.get('/colegios/listarTodos', {params});
          this.colegios = response.data.data;
          this.total = response.data.last_page;
        } catch (error) {
          console.log(error)
        } finally {
          this.cargando = false;
        }
      },

      inactivarColegio(item) {
        this.$swal({
          title: "¿Está Seguro?",
          text: "Inactivar colegio",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
        }).then(async (result) => {
          if (result.value) {
            const data = {
              id: item.id
            }
            this.$axios.post('/colegios/inactivarColegio', data).then((res) => {
                this.$toast.success('Colegio inactivo con exito.')
                this.listarColegio()
              })
              .catch((e) => {
                console.log(e);
              });
          }

        });
      },

      activarColegio(item) {
        this.$swal({
          title: "¿Está Seguro?",
          text: "Activar colegio",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
        }).then(async (result) => {
          if (result.value) {
            const data = {
              id: item.id
            }
            this.$axios.post('/colegios/activarColegio', data).then((res) => {
                this.$toast.success('Colegio inactivo con exito.')
                this.listarColegio()
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

      limpiarFiltros()
      {
        this.colegio = '',
        this.codigoDane = ''
        this.listarColegio()
      }

    },
  };

</script>

<style lang="scss" scoped></style>
