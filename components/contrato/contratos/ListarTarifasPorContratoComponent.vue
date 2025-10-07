<template>
  <!-- Tabla de datos que muestra las tarifas -->
  <v-data-table :headers="headers" :items="tarifas" :search="search" :loading="loading" dense>
    <!-- Encabezado de la tabla -->
    <template v-slot:top>
      <!-- Alerta informativa -->
      <v-alert text dense border="left" type="info" icon="mdi-file-document-outline">
        <div class="d-flex justify-space-between align-center">
          <strong>Tarifas</strong>
          <v-spacer></v-spacer>
          <CargueMasivoVariasTarifasComponent :tarifa_id="tarifa_id" @cerrar="getTarifas" class="mr-2" />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="error" v-bind="attrs" v-on="on" @click="getTarifas">
                mdi-reload
              </v-icon>
            </template>
            <span>Recargar Tarifas</span>
          </v-tooltip>
        </div>
      </v-alert>
  
  
  
      <!-- Diálogo modal para agregar cups -->
      <v-dialog v-model="dialogs.cups" max-width="800px">
        <v-card>
          <!-- Título del diálogo -->
          <v-card-title>
          </v-card-title>
  
          <!-- Contenido del diálogo -->
          <v-card-text>
            <!-- Componente para agregar cups a una tarifa -->
            <AgregarCupsTarifaComponent :tarifa_id="tarifa_id" :manual="nombreManual" @submit="listar()"
              @cerrar="dialogs.cups = false" />
          </v-card-text>
  
          <!-- Acciones del diálogo -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark color="error" @click="dialogs.cups = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Diálogo modal para agregar cdigos propios -->
      <v-dialog v-model="dialogs.codigosPropios" max-width="800px">
        <v-card>
          <!-- Título del diálogo -->
          <v-card-title>
          </v-card-title>
  
          <!-- Contenido del diálogo -->
          <v-card-text>
            <!-- Componente para agregar cups a una tarifa -->
            <AgregarCupsPropiosContratoComponent :tarifa_id="tarifa_id" :manual="nombreManual" @submit="listar()"
              @cerrar="dialogs.codigosPropios = false" />
          </v-card-text>
  
          <!-- Acciones del diálogo -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark color="error" @click="dialogs.codigosPropios = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Diálogo modal para agregar paquetes -->
      <v-dialog v-model="dialogs.paquetes" max-width="1000px">
        <v-card>
          <!-- Título del diálogo -->
          <v-card-title>
          </v-card-title>
  
          <!-- Contenido del diálogo -->
          <v-card-text>
            <!-- Componente para agregar cups a una tarifa -->
            <AgregarPaquetesContratoComponent :tarifa_id="tarifa_id" :manual="nombreManual" @submit="listar()"
              @cerrar="dialogs.paquetes = false" />
          </v-card-text>
  
          <!-- Acciones del diálogo -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark color="error" @click="dialogs.paquetes = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Diálogo modal para agregar municipios -->
      <v-dialog v-model="dialogs.municipio" max-width="700px">
        <v-card>
          <!-- Título del diálogo -->
          <v-card-title>
          </v-card-title>
  
          <!-- Contenido del diálogo -->
          <v-card-text>
            <!-- Componente para agregar cups a una tarifa -->
            <AgregarMunicipiosTarifasComponent :tarifa_id="tarifa_id" :manual="nombreManual" @submit="listar()"
              @cerrar="dialogs.codigosPropios = false" />
          </v-card-text>
  
          <!-- Acciones del diálogo -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark color="error" @click="dialogs.municipio = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

       <!-- Diálogo modal para agregar cums -->
      <v-dialog v-model="dialogs.cums" max-width="900px">
        <v-card>
          <!-- Título del diálogo -->
          <v-card-title>
          </v-card-title>
  
          <!-- Contenido del diálogo -->
          <v-card-text>
            <!-- Componente para agregar cups a una tarifa -->
            <AgregarCumsTarifasComponent :tarifa_id="tarifa_id" :manual="nombreManual" @submit="listar()"
              @cerrar="dialogs.cums = false" />
          </v-card-text>
  
          <!-- Acciones del diálogo -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark color="error" @click="dialogs.cums = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diálogo modal para agregar dx -->
      <v-dialog v-model="dialogs.diagnostico" max-width="700px">
        <v-card>
          <!-- Título del diálogo -->
          <v-card-title>
          </v-card-title>
  
          <!-- Contenido del diálogo -->
          <v-card-text>
            <!-- Componente para agregar cups a una tarifa -->
            <AgregarDiagnosticoCumsComponent :tarifa_id="tarifa_id" :manual="nombreManual" @submit="listar()"
              @cerrar="dialogs.diagnostico = false" />
          </v-card-text>
  
          <!-- Acciones del diálogo -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark color="error" @click="dialogs.diagnostico = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
  
      <v-dialog v-model="dialogs.tarifa" width="500">
        <FormTarifasComponent :editar="true" :tarifa_id="tarifa_id" :contrato_id="contrato_id"
          @cerrar="dialogs.tarifa = false" />
      </v-dialog>
  
      <!-- Campo de búsqueda en la tabla -->
      <v-text-field v-model="search" label="Buscar ..." outlined dense></v-text-field>
    </template>
  
    <!-- Renderizado personalizado para la columna 'pleno' -->
    <template v-slot:[`item.pleno`]="{ item }">
      <v-chip small dark :color="item.pleno ? 'success' : 'error'">
        {{ item.pleno ? "Sí" : "No" }}
      </v-chip>
    </template>
  
    <!-- Renderizado personalizado para la columna 'activo' -->
    <template v-slot:[`item.activo`]="{ item }">
      <v-chip small dark :color="item.activo ? 'success' : 'error'">
        {{ item.activo ? "Sí" : "No" }}
      </v-chip>
    </template>
  
    <!-- Columna de acciones -->
    <template v-slot:[`item.actions`]="{ item }">
      <div class="d-flex">
        <!-- Acción de editar -->
        <v-tooltip top v-if="$can('contrato.actualizar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" v-bind="attrs" v-on="on" @click="editar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
  
        <!-- Acción de agregar cups -->
        <v-tooltip top v-if="$can('contrato.actualizar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="primary" v-bind="attrs" v-on="on" @click="agregarCups(item)">
              mdi-plus
            </v-icon>
          </template>
          <span>Agregar cups</span>
        </v-tooltip>
  
        <!-- Acción de agregar cups -->
        <v-tooltip top
          v-if="$can('contrato.actualizar') && (item.manual_tarifario_id == 6 || item.manual_tarifario_id == 4)">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="rose" v-bind="attrs" v-on="on" @click="agregarCodigoPropio(item)">
              mdi-plus
            </v-icon>
          </template>
          <span>Agregar Codigos Propios</span>
        </v-tooltip>
  
        <!-- Acción de agregar cups -->
        <v-tooltip top
          v-if="$can('contrato.actualizar') && (item.manual_tarifario_id == 6 || item.manual_tarifario_id == 4)">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="success" v-bind="attrs" v-on="on" @click="agregarPaquetes(item)">
              mdi-plus
            </v-icon>
          </template>
          <span>Agregar Paquetes</span>
        </v-tooltip>
  
        <!-- Acción de agregar cups -->
        <v-tooltip top v-if="$can('contrato.actualizar') && item.manual_tarifario_id == 4">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="success" v-bind="attrs" v-on="on" @click="agregarMunicipio(item)">
              mdi-clipboard-outline
            </v-icon>
          </template>
          <span>Agregar Municipio</span>
        </v-tooltip>
        
         <!-- Acción de agregar cups -->
        <v-tooltip top v-if="$can('contrato.medicamentos')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="info" v-bind="attrs" v-on="on" @click="agregarCums(item)">
              mdi-pill
            </v-icon>
          </template>
          <span>Agregar Cums</span>
        </v-tooltip>

         <!-- Acción de agregar cups -->
        <v-tooltip top v-if="$can('contrato.medicamentos')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="info" v-bind="attrs" v-on="on" @click="agregarDiagnostico(item)">
              mdi-pill
            </v-icon>
          </template>
          <span>Agregar Diagnosticos</span>
        </v-tooltip>

        <!-- Acción de eliminar -->
        <v-tooltip top v-if="$can('contrato.actualizar')">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="error" v-bind="attrs" v-on="on" @click="eliminarTarifa(item)">
              mdi-trash-can
            </v-icon>
          </template>
          <span>Eliminar</span>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import AgregarDiagnosticoCumsComponent from '@/components/contrato/contratos/medicamentos/AgregarDiagnosticoCumsComponent.vue';
import AgregarCumsTarifasComponent from '@/components/contrato/contratos/medicamentos/AgregarCumsTarifasComponent.vue';
import AgregarCupsTarifaComponent from '@/components/contrato/contratos/AgregarCupsTarifaComponent.vue';
import AgregarCupsPropiosContratoComponent from '@/components/contrato/contratos/AgregarCupsPropiosContratoComponent.vue';
import AgregarPaquetesContratoComponent from '@/components/contrato/contratos/AgregarPaquetesContratoComponent.vue';
import FormTarifasComponent from '@/components/contrato/tarifas/FormTarifasComponent.vue';
import CargueMasivoVariasTarifasComponent from './CargueMasivoVariasTarifasComponent.vue';
import AgregarMunicipiosTarifasComponent from './AgregarMunicipiosTarifasComponent.vue';


export default {

  name: "hijoTarifas",
  components: {
    AgregarCupsTarifaComponent,
    AgregarCupsPropiosContratoComponent,
    AgregarPaquetesContratoComponent,
    FormTarifasComponent,
    CargueMasivoVariasTarifasComponent,
    AgregarMunicipiosTarifasComponent,
    AgregarCumsTarifasComponent,
    AgregarDiagnosticoCumsComponent
  },

  props: {
    contrato_id: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      reload: false,
      loading: false, // Indicador de carga
      search: '', // Texto de búsqueda
      dialogs: {
        cups: false, // Controla la visibilidad del diálogo para agregar cups
        paquetes: false,
        codigosPropios: false,
        tarifa: false,
        municipio: false,
        cums: false,
        diagnostico: false
      },
      tarifa_id: null, // ID de la tarifa seleccionada
      nombreManual: null, // Nombre del manual tarifario
      tarifas: [], // Lista de tarifas
      headers: [{
        text: 'Id',
        value: 'id'
      },
      {
        text: 'Etiqueta',
        value: 'etiqueta'
      },
      {
        text: 'Sede',
        value: 'rep.nombre'
      },
      {
        text: 'Tipo manual',
        value: 'manual_tarifario.nombre'
      },
      {
        text: 'Pleno',
        value: 'pleno'
      },
      {
        text: 'Tarifa',
        value: 'valor'
      },
      {
        text: 'Estado',
        value: 'activo'
      },
      {
        text: 'Acciones',
        value: 'actions',
        sortable: false,
        align: 'center'
      },
      ],
    };
  },

  watch: {
    // Observa cambios en 'contrato_id' para obtener las tarifas asociadas
    contrato_id: {
      handler(value) {
        if (value) {
          this.getTarifas();
          this.reload = true;
        }
      },
      immediate: true, // Ejecuta el handler inmediatamente al crear el componente
    },
  },

  methods: {
    // Método para obtener las tarifas asociadas al contrato
    async getTarifas() {
      try {
        this.loading = true; // Muestra indicador de carga
        const {
          data
        } = await this.$axios.get(`/tarifa/listar-por-contrato/${this.contrato_id}`);
        this.tarifas = data; // Asigna las tarifas obtenidas
      } catch (error) {
        console.error(error);
        this.$toast.error('Error al obtener las tarifas.');
      } finally {
        this.loading = false; // Oculta indicador de carga
      }
    },

    // Método para abrir el diálogo y agregar cups a una tarifa
    agregarCups(item) {
      this.dialogs.cups = true;
      this.tarifa_id = item.id;
      this.nombreManual = `${item.manual_tarifario.nombre} ${item.valor}%`;
    },

    // Método para abrir el diálogo y agregar cups a una tarifa
    agregarCodigoPropio(item) {
      this.dialogs.codigosPropios = true;
      this.tarifa_id = item.id;
      this.nombreManual = `${item.manual_tarifario.nombre} ${item.valor}%`;
    },

    // Método para abrir el diálogo y agregar cups a una tarifa
    agregarPaquetes(item) {
      this.dialogs.paquetes = true;
      this.tarifa_id = item.id;
      this.nombreManual = `${item.manual_tarifario.nombre} ${item.valor}%`;
    },

    agregarMunicipio(item) {
      this.dialogs.municipio = true;
      this.tarifa_id = item.id;
      this.nombreManual = `${item.manual_tarifario.nombre} ${item.valor}%`;
    },

    agregarCums(item){
      this.dialogs.cums = true;
      this.tarifa_id = item.id;
      this.nombreManual = `${item.manual_tarifario.nombre} ${item.valor}%`;
    },

    agregarDiagnostico(item){
      this.dialogs.diagnostico = true;
      this.tarifa_id = item.id;
      this.nombreManual = `${item.manual_tarifario.nombre} ${item.valor}%`;
    },

    // Método para restablecer los datos después de agregar cups
    listar() {
      this.tarifa_id = null;
      this.nombreManual = null;
      // Opcionalmente, puedes volver a cargar las tarifas si es necesario
      this.getTarifas();
    },

    // Método para editar una tarifa (pendiente de implementación)
    editar(item) {
      this.tarifa_id = item.id;
      this.dialogs.tarifa = true;
    },

    // Método para eliminar una tarifa
    eliminarTarifa(item) {
      this.$swal({
        title: "¿Está Seguro?",
        text: `Se eliminará la tarifa "${item.id} - ${item.manual_tarifario.descripcion} - ${item.rep.nombre}"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then((res) => {
        if (res.value) {
          this.preload = true;
          const data = {
            tarifa_id: item.id,
          };
          this.$axios
            .post(`/tarifa/eliminar/${data.tarifa_id}`)
            .then(() => {
              this.getTarifas();
              this.$toast.success('Se eliminó correctamente la tarifa');
            })
            .catch((error) => {
              this.$toast.error('Error al eliminar la tarifa');
            })
            .finally(() => {
              this.preload = false;
            });
        }
      });
    },
  },
};

</script>
