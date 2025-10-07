<template>
  <div>
    <!-- Preload -->
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

    <!-- Modal -->
    <v-card :disabled="loading" :loading="loading">
      <v-alert dense text border="left" icon="mdi-clipboard-text" type="info" color="info">
        <div class="d-flex justify-space-between">
          <b>Modalidad de Contrato {{ nombreTarifa }} {{ valorTarifa }}</b>
          <v-btn color="error" @click="cerrar" small>Cerrar</v-btn>
        </div>
      </v-alert>
      <v-card-text>

        <v-row dense>
          <v-col cols="12" sm="5" md="5">
            <v-text-field label="Consultar Familias por código o nombre (CUPS)" dense outlined v-model="nombreFamilias" />
          </v-col>
          <v-col cols="12" sm="1" md="1">
            <v-btn color="primary" dark small style="width: 100%;" @click="consultarFamilias">
              Consultar
            </v-btn>
          </v-col>
          <v-col cols="12" sm="5" md="5">
            <v-autocomplete label="Seleccionar las Unidades Funcionales" dense outlined :items="opcionesFamilias"
              multiple chips small-chips item-text="nombre" item-value="id"
              no-data-text="Digite el nombre de la familia" v-model="familias" />
          </v-col>
          <v-col cols="12" sm="1" md="1">
            <v-btn color="primary" dark small style="width: 100%;" @click="agregarFamilias">
              Agregar
            </v-btn>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" sm="12" md="12">
            <v-data-table dense :headers="headersFamiliaTarifas" :items="familiaTarifas" :items-per-page="5"
              no-data-text="Sin datos para mostrar.">
              <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="success" small class="mr-2" v-bind="attrs" v-on="on" @click="agregarCupsFamilia(item)">mdi-book-plus</v-icon>
                  </template>
                  <span>Agregar Rango</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="error" small class="mr-2" v-bind="attrs" v-on="on" @click="eliminarCupsFamilia(item)">mdi-book-minus</v-icon>
                  </template>
                  <span>Quitar Rango</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <!-- Agregar cup individual -->
        <v-row dense>
          <v-col cols="12" sm="11" md="11">
            <v-autocomplete label="Seleccionar un CUPS" dense outlined :items="cups" :search-input.sync="campoBusqueda"
              return-object item-text="nombre" v-model="selectedCup" :loading="loading"
              no-data-text="Digite el nombre o código de un CUPS para agregar." />
          </v-col>
          <v-col cols="12" sm="1" md="1">
            <v-btn color="primary" dark small style="width: 100%;" @click="agregarCupIndividual()">Agregar</v-btn>
          </v-col>
        </v-row>

        <v-row dense>
          <!-- filtros -->
          <v-col cols="12" sm="2" md="4">
            <v-text-field dense label="Nombre" outlined v-model="filtro.nombre" />
          </v-col>
          <v-col cols="12" sm="2" md="2">
            <v-text-field dense label="Código CUPS" outlined v-model="filtro.codigo" />
          </v-col>
          <v-col cols="12" sm="2" md="2">
            <v-text-field dense label="Ámbito" outlined v-model="filtro.ambito_id" />
          </v-col>
          <v-col cols="12" sm="2" md="2">
            <v-text-field dense label="Valor" outlined v-model="filtro.valor" />
          </v-col>
          <v-col cols="12" sm="2" md="2">
            <div class="d-flex justify-space-between px-2">
              <v-btn v-if="$can('cups.listar')" small color="primary" dark @click="listarCupsTarifas" style="width: 45%;">Filtrar</v-btn>
              <v-btn v-if="$can('cups.listar')" small color="warning" dark @click="limpiarFiltro" style="width: 45%;">Limpiar</v-btn>
            </div>
          </v-col>
        <!-- tabla de cups -->
          <v-col cols="12" sm="12" md="12">
            <v-data-table dense :items="cupsTarifas" :headers="headersCupsTarifas" disable-pagination hide-default-footer no-data-text="Sin datos para mostrar.">
              <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip top v-if="$can('cups.guardar')">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="error" small class="mr-2" v-bind="attrs" v-on="on" @click="eliminarCupTarifaIndividual(item)">mdi-delete</v-icon>
                  </template>
                  <span>Quitar Cup</span>
                </v-tooltip>
              </template>
              <template v-slot:[`item.valor`]="{ item }">
                <v-edit-dialog :return-value.sync="item.valor" @save="actualizarValorCupTarifa(item)" @open="open" @close="close">
                  {{ formatearPrecio(item.valor) }}
                  <template v-slot:input>
                    <v-text-field v-model="item.valor" label="Editar Valor" single-line></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-pagination v-model="pagina" :length="total" :total-visible="9" @input="listarCupsTarifas"></v-pagination>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Modal Familia CUPS -->
    <v-dialog v-model="modalFamiliaCups" persistent max-width="1200px" scrollable>
      <v-card>
        <v-alert dense text border="left" icon="mdi-list-box-outline" type="info" color="info">
          <div class="d-flex justify-space-between">
            <b>CUPS Vs Familia</b>
            <v-btn color="error" @click="cerrarModalFamiliaCups" small>Cerrar</v-btn>
          </div>
        </v-alert>
        <v-card-text>
          <v-item v-for="(cupsFamilia, i) in cupsFamilias" :key="i">
            <v-alert border="left" colored-border type="info" elevation="1">
              El CUPS <strong>{{ cupsFamilia.CodigoNombre }}</strong> se encuentra en la Familia <strong>{{ cupsFamilia.familia_nombre }}.</strong>
            </v-alert>
          </v-item>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';

export default {
  middleware({ $can, redirect }) {
    if (!$can('contrato.listar')) {
      redirect('/');
    }
  },
  name: 'AgregarCupsContrato',
  props: {
    tarifa_id: Number,
    nombreTarifa: String,
    valorTarifa: String,
    editando: Boolean
  },
  watch: {
    tarifa_id() {
      if (this.editando) {
        this.listarFamiliaTarifas();
        this.listarCupsTarifas();
      }
    },
    campoBusqueda: function (newVal) {
    if (newVal && newVal.length === 6) {
        this.listarCups()
      }
    }
  },
  data() {
    return {
      preload: false,
      loading: false,
      nombreFamilias: '',
      cupsFamilias: [],
      opcionesFamilias: [],
      familias: [],
      modalFamiliaCups: false,
      familiaTarifas: [],
      headersFamiliaTarifas: [
        { text: 'ID', value: 'familia_id' },
        { text: 'Familia', value: 'nombre' },
        { text: 'Acciones', value: 'acciones', sortable: false, align: 'center' },
      ],
      cups: [],
      selectedCup: null,
      campoBusqueda: '',
      cupsTarifas: [],
      headersCupsTarifas: [
        { text: 'Código', value: 'codigo' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Nivel Ordenamiento', value: 'nivel_ordenamiento' },
        { text: 'Periodicidad', value: 'periodicidad' },
        { text: 'Valor', value: 'valor' },
        { text: 'Acciones', value: 'acciones', sortable: false, align: 'center' },
      ],
      opciones: [5, 10, 15, 20, 50, 100],
      opcionActual: 5,
      pagina: 1,
      total: 0,
      filtro: {
        tarifa_id: this.tarifa_id,
        codigo: '',
        nombre: '',
        ambito_id: null,
        valor: '',
      }
    };
  },
  created() {
    this.debouncedListarCups = debounce(this.listarCups, 300);
  },
  mounted() {
    this.listarOpcionesFamilias(); 
  },
  methods: {
    cerrar() {
      this.$emit('cerrar');
      this.nombreFamilias = '';
    },
    formatearPrecio(valor) {
      if (!valor) return '';
      const valorRedondeado = Math.round(valor);
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(valorRedondeado);
    },
    listarOpcionesFamilias() {
      this.loading = true;
      this.$axios.post('/familia/listar').then(res => {
        this.opcionesFamilias = res.data.data;
      }).catch(error => {
        this.$toast.error('Error al cargar las familias');
        console.log(error);
      }).finally(() => {
        this.loading = false;
      });
    },
    listarFamiliaTarifas() {
      this.loading = true;
      this.$axios.get(`/familia/${this.tarifa_id}`).then(res => {
        this.familiaTarifas = res.data;
      }).catch(error => {
        this.$toast.error('Error al cargar las familias');
        console.log(error);
      }).finally(() => {
        this.loading = false;
      });
    },
    consultarFamilias() {
      if (!this.nombreFamilias) {
        this.$toast.error('Debe digitar el nombre o el CUPS');
        return;
      }

      this.preload = true;
      this.$axios.post('/familia/cups', { nombreCups: this.nombreFamilias }).then(res => {
        this.modalFamiliaCups = true;
        this.cupsFamilias = res.data;
      }).catch(error => {
        this.$toast.error('Error al consultar familias');
        console.log(error);
      }).finally(() => {
        this.preload = false;
        this.nombreFamilias = '';
      });
    },
    cerrarModalFamiliaCups() {
      this.modalFamiliaCups = false;
      this.cupsFamilias = [];
    },
    agregarFamilias() {
      if (this.familias.length == 0) {
        this.$toast.error('Debe seleccionar al menos una familia');
        return;
      }

      this.preload = true;
      this.$axios.post(`/familia/sincronizarTarifa/${this.tarifa_id}`, { familias: this.familias }).then(res => {
        this.$toast.success('Las familias se agregaron correctamente.');
        this.listarFamiliaTarifas();
        this.familias = [];
      }).catch(error => {
        this.$toast.error('Error al agregar las familias');
        console.log(error);
      }).finally(() => {
        this.preload = false;
      });
    },
    agregarCupsFamilia(item) {
      this.$swal({
        title: "¿Está Seguro?",
        text: `Se agregará la Unidad Funcional "${item.nombre}"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",
      }).then(res => {
        if (res.value) {
          this.preload = true;
          const data = {
            tarifa_id: this.tarifa_id,
            familia_id: item.familia_id
          };
          this.$axios.post(`/tarifa/tarifa-cups/${this.tarifa_id}`, data).then(() => {
            this.listarCupsTarifas();
            this.$toast.success('Se agrgaron los CUPS de la Unidad Funcional correctamente');
          }).catch(error => {
            this.$toast.error('Error al agregar la Unidad Funcional');
            console.log(error);
          }).finally(() => {
            this.preload = false;
          });
        }
      });
    },
    eliminarCupsFamilia(item) {
      this.$swal({
        title: "¿Está Seguro?",
        text: `Se eliminará la Unidad Funcional "${item.nombre}" y sus CUPS de esta tarifa`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then(res => {
        if (res.value) {
          const data = {
            familia_id: parseInt(item.familia_id),
            tarifa_id: this.tarifa_id
          };
          this.preload = true;
          this.$axios.delete('/tarifa/eliminarCupsTarifas', { data: data }).then(() => {
            this.listarCupsTarifas();
            this.listarFamiliaTarifas();
            this.$toast.success('Se quitaron la Unidad Funcional y sus CUPS correctamente');
          }).catch(error => {
            this.$toast.error('Error al quitar la Unidad Funcional y sus CUPS');
            console.log(error);
          }).finally(() => {
            this.preload = false;
          });
        }
      });
    },
  
    listarCups() {
      this.loading = true;
      this.$axios.get(`/cup/BuscarCup/${this.campoBusqueda}`).then(res => {
        this.cups = res.data.original.map(cup => {
          return {
            id: cup.id,
            nombre: cup.cups,
            codigo: cup.codigo
          };
        });
      }).catch(error => {
        this.$toast.error('Error al cargar los CUPS');
        console.log(error);
      }).finally(() => {
        this.loading = false;
      });
    },
    
    agregarCupIndividual() {

      if (!this.selectedCup) {
        this.$toast.error('Debe seleccionar un CUP');
        return;
      }

      const cupExistente = this.cupsTarifas.find(cup => cup.codigo === this.selectedCup.codigo);
      if (cupExistente) {
        this.$toast.error('El CUP seleccionado ya existe en la lista');
        return;
      }

      this.$swal({
        title: "¿Está seguro?",
        text: `Se agregará el CUPS "${this.selectedCup.nombre}"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          this.preload = true;
          this.$axios.post(`/tarifa/tarifa-cups/${this.tarifa_id}`, { cup_id: this.selectedCup.id }).then(() => {
            this.$toast.success('El CUP se agrego correctamente');
            this.listarFamiliaTarifas();
            this.listarCupsTarifas();
            this.selectedCup = null;
          }).catch(error => {
            this.$toast.error('No se ha podido agregar el CUP');
            console.log(error);
          }).finally(() => {
            this.preload = false;
            this.campoBusqueda = '';
          });
        }
      });
    },
    listarCupsTarifas() {
      this.preload = true;
      this.filtro['tarifa_id'] = this.tarifa_id
      this.$axios.post(`/tarifa/listarCupsTarifas?page=${this.pagina}&cant=${this.opcionActual}`, this.filtro).then(res => {
        this.cupsTarifas = res.data.data;
        this.total = res.data.last_page;
      }).catch(error => {
        this.$toast.error('Error al cargar los CUPS');
        console.log(error);
      }).finally(() => {
        this.preload = false;
      });
    },
    eliminarCupTarifaIndividual(item) {
      this.$swal({
        title: "¿Está seguro?",
        text: `Se quitará el CUPS "${item.nombre}"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then(res => {
        if (res.value) {
          this.preload = true;
          this.$axios.post('/tarifa/deleteCupsTarifas', { cup_tarifas_id: item.cup_tarifas_id }).then(() => {
            this.listarCupsTarifas();
            this.$toast.success('Se quitó el CUP correctamente');
          }).catch(error => {
            this.$toast.error('No se ha podido quitar el CUP');
            console.log(error);
          }).finally(() => {
            this.preload = false;
          });
        }
      });
    },
    limpiarFiltro() {
      this.filtro.ambito_id = null;
      this.filtro.codigo = '';
      this.filtro.valor = '';
      this.filtro.nombre = '';

      this.listarCupsTarifas();
    },
    actualizarValorCupTarifa(item) {
      this.preload = true;
      this.$axios.put('/tarifa/actualizarPrecioCupsTarifa', {
        cup_tarifas_id: item.cup_tarifas_id,
        valor: item.valor
      }).then(res => {
        this.$toast.success('Se actualizó correctamente el valor');
      }).catch(error => {
        this.$toast.error('No se ha podido actualizar el valor');
        console.log(error);
      }).finally(() => {
        this.preload = false;
        this.listarCupsTarifas();
      });
    },
    open() {
      this.$toast.info('Edición abierta');
    },
    close() {
      this.$toast.info('Edición cerrada');
    }
  }
};
</script>
