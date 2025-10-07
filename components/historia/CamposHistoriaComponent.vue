<template>
  <div>
    <v-container fluid class="pa-0">
      <v-card-title class="titulo">Crear campo historia</v-card-title>
      <form @submit.prevent="guardarCampoHistoria">
        <v-card>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="3">
                <v-autocomplete v-model="campoHistoria.categoria_historia_id" label="Categoria historia"
                  :items="categoriaHistorias" item-text="nombre" item-value="id"
                  :error-messages="errors.categoria_historia_id">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-text-field v-model="campoHistoria.nombre" label="Nombre" :error-messages="errors.nombre">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-autocomplete v-model="campoHistoria.tipo_campo_id" label="Tipo de campo" :items="tipoCampo"
                  :item-text="tipoCampo => tipoCampo.nombre+' - '+ tipoCampo.descripcion" item-value="id"
                  :error-messages="errors.tipo_campo_id">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-autocomplete v-model="campoHistoria.ciclo_vida" label="Ciclo de vida" :items="cicloVida"
                  :error-messages="errors.ciclo_vida">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-autocomplete v-model="campoHistoria.requerido" label="Requerido" :items="siNo" item-text="nombre"
                  item-value="value" :error-messages="errors.requerido">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-text-field v-model="campoHistoria.orden" label="Orden" type="number" :error-messages="errors.orden">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-text-field v-model="campoHistoria.columnas" label="Columnas" type="number"
                  :error-messages="errors.columnas">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="1">
                <v-btn class="mx-2" fab dark small color="success" @click="guardarCampoHistoria()">
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </form>
    </v-container>
    <v-card class="mt-2">
      <v-alert class="text-center" dense text outlined type="info" icon="mdi-magnify">Filtrar por categoría</v-alert>
      <v-container>
        <v-row>
          <v-col cols="12" sm="12" md="5">
            <v-autocomplete v-model="filtro.filtro" label="Categoria historia" :items="categoriaHistorias"
              item-text="nombre" item-value="id" :error-messages="errors.categoria_historia_id">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="pt-9">
            <v-btn small depressed color="warning" @click="limpiarFiltro()">
              Limpiar
            </v-btn>
            <v-btn small depressed color="primary" @click="listarCampoHistoria()">
              Filtrar
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-data-table :headers="headers" :items="campoHistorias" class="elevation-1 mt-2"
      loading-text="Cargando... por favor espere" hide-default-footer>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <div class="text-center">
      <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarCampoHistoria()">
      </v-pagination>
    </div>

    <v-dialog v-model="dialog" max-width="900px">
      <v-container fluid class="pa-0">
        <v-card>
          <v-card-title class="titulo">
            <span class="white--text text-h5">{{titulo}}</span>
          </v-card-title>
          <form @submit.prevent="guardarCampoHistoria">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="6">
                    <v-text-field v-model="campoHistoria.nombre" label="Nombre" :error-messages="errors.nombre">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-autocomplete v-model="campoHistoria.tipo_campo_id" label="Tipo de campo" :items="tipoCampo"
                      :item-text="tipoCampo => tipoCampo.nombre+' '+ tipoCampo.descripcion" item-value="id"
                      :error-messages="errors.tipo_campo_id">
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-autocomplete v-model="campoHistoria.ciclo_vida" label="Ciclo de vida" :items="cicloVida"
                      :error-messages="errors.ciclo_vida">
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-autocomplete v-model="campoHistoria.requerido" label="Requerido" :items="siNo" item-text="nombre"
                      item-value="value" :error-messages="errors.requerido">
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-autocomplete v-model="campoHistoria.categoria_historia_id" label="Categoria historia"
                      :items="categoriaHistorias" item-text="nombre" item-value="id"
                      :error-messages="errors.categoria_historia_id">
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model.number="campoHistoria.orden" label="Orden" type="number">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="3">
                    <v-text-field v-model="campoHistoria.columnas" label="Columnas">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="close()">
                Cancelar
              </v-btn>
              <v-btn color="boton" dark @click="guardarCampoHistoria()">
                Guardar
              </v-btn>
            </v-card-actions>
          </form>
        </v-card>
      </v-container>
    </v-dialog>
  </div>
</template>

<script>
  import {
    listarCampoHistoria,
    guardarCampoHistoria,
    actualizarCampoHistoria,
  } from '@/api/historia/campoHistoria'
  import {
    listarCategoriaHistoria
  } from '@/api/historia/categoriaHistoria'
  import {
    listarTipoCampo
  } from '@/api/historia/tipoCampo'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonCamposHistoria',

    data() {
      return {
        loading: false,
        dialog: false,
        dialogoEditar: false,
        buscarCampoHistoria: '',
        campoHistorias: [],
        categoriaHistorias: [],
        tipoCampo: [],
        filtro: {
          filtro: ''
        },
        campoHistoria: {
          nombre: '',
          tipo_campo_id: '',
          requerido: '',
          categoria_historia_id: '',
          ciclo_vida: '',
          orden: '',
          columnas: ''
        },
        editedIndex: -1,
        defecto: {
          nombre: '',
          tipo_campo_id: '',
          requerido: '',
          categoria_historia_id: '',
          ciclo_vida: '',
          orden: '',
          columnas: ''
        },
        errors: {
          nombre: '',
          tipo_campo_id: '',
          requerido: '',
          categoria_historia_id: '',
          ciclo_vida: '',
          orden: '',
          columnas: ''
        },
        paginate: {
          total: 0,
          page: 1
        },
        siNo: [{
          nombre: 'Si',
          value: 1
        }, {
          nombre: 'No',
          value: 0
        }],
        tipoCampo: [''],
        cicloVida: ['Primera infancia', 'Infancia', 'Juventud', 'Vejez'],
        headers: [{
            text: 'id',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Tipo campo',
            value: 'nombreTipoCampo'
          },
          {
            text: 'Categoria',
            value: 'nombreCategoria'
          },
          {
            text: 'Ciclo de vida',
            value: 'ciclo_vida'
          },
          {
            text: 'Requerido',
            value: 'campoRequerido'
          },
          {
            text: 'Orden',
            value: 'orden'
          },
          {
            text: 'Columnas',
            value: 'columnas'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
      };
    },

    mounted() {
      this.listarCategoriaHistoria();
      this.listarTipoCampo();
    },

    computed: {
      titulo() {
        return this.editedIndex === -1 ? 'Crear campo historia' : 'Editar campo historia'
      },
    },

    watch: {
      dialogoBloqueos(val) {
        val || this.cerrarDialogo()
      }
    },

    methods: {

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.campoHistoria = Object.assign({}, this.defecto)
          this.editedIndex = -1
        })
        this.limpiarError()
      },


      async listarCampoHistoria() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingPostRequest(listarCampoHistoria(this.paginate.page), this.filtro)
          this.campoHistorias = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

      async guardarCampoHistoria() {
        this.limpiarError()
        if (this.editedIndex > -1) {
          try {
            const request = {
              'nombre': this.campoHistoria.nombre,
              'tipo_campo_id': this.campoHistoria.tipo_campo_id,
              'requerido': this.campoHistoria.requerido,
              'categoria_historia_id': this.campoHistoria.categoria_historia_id,
              'ciclo_vida': this.campoHistoria.ciclo_vida,
              'orden': this.campoHistoria.orden,
              'columnas': this.campoHistoria.columnas
            }
            const {
              data
            } = await this.$loadingPutRequest(actualizarCampoHistoria(this.campoHistoria.id), request)
            this.$toast.success(data.mensaje)
            this.listarCampoHistoria()
            this.close()
          } catch (error) {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          }
        } else {
          try {
            const {
              data
            } = await this.$loadingPostRequest(guardarCampoHistoria(), this.campoHistoria)
            if (data.data == 'false') {
              this.$toast.error(
                'No se pudo crear el campo ya que existe una categoria con ese orden, por favor cambiar el orden por uno que no este en uso.'
                )
            } else {
              this.$toast.success(data.mensaje)
              this.close()
            }

          } catch (error) {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
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

      editar(item) {
        console.log('item', item);
        this.editedIndex = this.campoHistorias.indexOf(item)
        this.campoHistoria = Object.assign({}, item)
        this.campoHistoria.tipo_campo_id = parseInt(item.tipo_campo_id)
        this.campoHistoria.requerido = parseInt(item.requerido)
        this.campoHistoria.categoria_historia_id = parseInt(item.categoria_historia_id)
        this.dialog = true
      },

      async listarCategoriaHistoria() {
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarCategoriaHistoria(0))
          this.categoriaHistorias = data.data
        } catch (error) {

        }
      },

      async listarTipoCampo() {
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarTipoCampo(0))
          this.tipoCampo = data.data
        } catch (error) {

        }
      },

      limpiarFiltro() {
        this.filtro.filtro = ''
        this.campoHistorias = []
      }

    },
  };

</script>
