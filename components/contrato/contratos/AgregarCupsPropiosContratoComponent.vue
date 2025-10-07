<template>
  <div>
    <v-alert text dense border="left" type="info" icon="mdi-file-document-outline">
        <div class="d-flex justify-space-between">
          <!-- Título y componente para carga masiva -->
          <strong>Agregar Codigo Propio a {{ manual }} - código: {{ tarifa_id }}</strong>
          <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-if="reload = true" color="error" v-bind="attrs" v-on="on" @click="getCupPropios()">
              mdi-reload
            </v-icon>
          </template>
          <span>Recargar Tarifas</span>
        </v-tooltip>
        </div>
      </v-alert>
    <v-card-text>
      <v-row>
        <v-col col="12" sm="6" md="10">
          <v-autocomplete v-model="selectedCodigoPropio" outlined label="Buscar código propio" :items="codigosPropios"
            item-text="CodigoNombre" :loading="loading" :search-input.sync="campoBusqueda" dense return-object
            no-data-text="Debe introducir 6 dígitos para buscar"></v-autocomplete>
        </v-col>
        <v-col col="12" sm="6" md="2">
          <v-btn color="primary" small dark @click="agregar()">Agregar</v-btn>
        </v-col>
          <!-- Campo de búsqueda en la tabla -->
      <v-text-field v-model="search" label="Buscar en tabla..." outlined dense></v-text-field>
      </v-row>


      <v-data-table :headers="headers" :items="cupPropio" :search="search" dense :loading="loading">
        <template v-slot:[`item.quirurgico`]="{ item }">
          <v-chip small dark :color="item.quirurgico ? 'success' : 'error'">{{ item.quirurgico ? 'Sí' : 'No' }}</v-chip>
        </template>

        <template v-slot:[`item.diagnostico_requerido`]="{ item }">
          <v-chip small dark :color="item.diagnostico_requerido ? 'success' : 'error'">
            {{ item.diagnostico_requerido ? 'Sí' : 'No' }}
          </v-chip>
        </template>

        <template v-slot:[`item.requiere_auditoria`]="{ item }">
          <v-chip small dark :color="item.requiere_auditoria ? 'success' : 'error'">
            {{ item.requiere_auditoria ? 'Sí' : 'No' }}
          </v-chip>
        </template>
        <template v-slot:[`item.tarifa[0].pivot.valor`]="{ item }">
          <v-edit-dialog :return-value.sync="item.tarifa[0].pivot.valor" @save="save(item)" @open="open" @close="close">
            {{ formatCurrency(item.tarifa[0].pivot.valor) }}
            <template v-slot:input>
              <v-text-field v-model="item.tarifa[0].pivot.valor" label="Editar precio" single-line></v-text-field>
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:[`item.activo`]="{ item }">
          <v-chip dark small :color="item.activo ? 'success' : 'error'">{{ item.activo ? 'Activo' : 'Inactivo'
            }}</v-chip>
        </template>

        <template v-slot:[`item.acciones`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon small @click="eliminar(item)" color="error" v-bind="attrs" v-on="on">mdi-delete</v-icon>
            </template>
            <span>Eliminar Código Propio</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
  </div>
</template>

<script>
export default {
  name: 'AgregarCupsPropiosContrato',

   props: {
      tarifa_id: {
        type: Number,
        default: null,
      },
      manual: {
        type: String,
        default: null,
      }
    },

 
  watch: {
      // Observa cambios en tarifa_id para actualizar cupsTarifa
      tarifa_id: {
        handler(value, oldValue) {
          if (value) {
            this.getCupPropios();
          }
        },
        immediate: true,
      },

    campoBusqueda: function (newVal) {
      if (newVal && newVal.length === 4) {
        this.listarCodigosPropios()
      }
    },
  },

  data() {
    return {
      selectedCodigoPropio: null,
      campoBusqueda: '',
      codigosPropios: [],
      headers: [
        { text: 'Código', value: 'codigo' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Valor', value: 'tarifa[0].pivot.valor' },
        { text: 'Estado', value: 'activo' },
        { text: 'Acciones', value: 'acciones', sortable: false, align: 'center' },
      ],
      cupPropio: [],
      form: {
        cups: [],
        tarifa_id: null,
      },
      loading: false,
      search:'',
    };
  },

  mounted() {
    if (this.editando) {
      this.getCupPropios();
    }
  },

  methods: {
    listarCodigosPropios() {
      this.loading = true;
      this.$axios.get('/codigo-propio/BuscarCodigoPropio/' + this.campoBusqueda).then(res => {
        this.codigosPropios = res.data.original;
      }).catch(error => {
        this.$toast.error('Ocurrio un error al buscar los Códigos Propios, por favor recargue la página.');
      }).finally(() => {
        this.loading = false;
      })
    },
    getCupPropios() {
      this.loading = true;
      this.$axios
        .get(`/tarifa/listarCodigosPropiosTarifas/${this.tarifa_id}`)
        .then((res) => {
          this.cupPropio = res.data;
        })
        .catch((error) => {
          this.$toast.error(error.response.mensaje);
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    agregar() {
      // Verificar si el usuario ha seleccionado al menos un código propio
      if (!this.selectedCodigoPropio) {
        return this.$toast.error('Debe seleccionar al menos un código propio');
      }

      // Verificar si el código propio ya existe
      const existeCodigoPropio = this.cupPropio.some(codigo => codigo.id === this.selectedCodigoPropio.id);
      if (existeCodigoPropio) {
        return this.$toast.error('Este código propio ya existe');
      }

      this.loading = true;
      this.form.tarifa_id = this.tarifa_id;
      this.form.codigoPropio_id = this.selectedCodigoPropio.id;
      this.$axios
        .post('/tarifa/tarifa-propia', this.form)
        .then((res) => {
          this.getCupPropios();
          this.$toast.success('El código se agregó correctamente');
          this.selectedCodigoPropio = null;
        })
        .catch((error) => {
          this.$toast.error('No se ha podido agregar el código');
        }).finally(() => {
          this.loading = false;
        })
    },

    eliminar(item) {
      const tarifa_id = this.tarifa_id
      this.$swal({
        title: 'Desea eliminar este Código Propio?',
        text: 'Al aceptar este mensaje, se eliminará el Código Propio',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          this.preload = true
          this.$axios
            .delete(`/tarifa/eliminarCodigoPropioTarifa/${tarifa_id}/${item.id}`)
            .then((res) => {
              this.getCupPropios();
              this.$toast.success('Se elimino correctamente el Código Propio');
            })
            .catch((error) => {
              this.$toast.error('No se ha podido eliminar el Código Propio');
            }).finally(() => {
              this.preload = false
            })
        }
      })
    },

     // Formatea un valor numérico como moneda en pesos colombianos
     formatCurrency(value) {
        if (value !== null && value !== undefined) {
          // Utiliza Intl.NumberFormat para formatear el número
          return '$' + new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0
          }).format(value);
        } else {
          return '';
        }
      },

    save(item) {
      this.preload = true
      this.$axios.put('/tarifa/actualizarPrecioCodigoPropio', {
        tarifa_id: this.tarifa_id,
        codigo_propio_id: item.id,
        precio: item.tarifa[0].pivot.valor
      }).then(res => {
        this.$toast.success('Se actualizo correctamente el Código Propio');
      }).catch(error => {
        this.$toast.error('No se ha podido actualizar el Código Propio');
        console.log(error);
      }).finally(() => {
        this.preload = false
        this.getCupPropios();
      })
    },

    open() {
      this.$toast.info('Edición de abierta');
    },
    close() {
      this.$toast.info('Edición de cerrada');
    }

  },
};
</script>
