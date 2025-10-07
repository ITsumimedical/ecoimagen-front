<template>
  <v-card>

    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
            <span>Citas</span>
          </div>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn small color="success" dark class="mb-2" @click="(crearActividad = true), (cita.actualizar = false)">
          Crear cita
          <v-icon dark right>
            mdi-plus-circle-outline
          </v-icon>
        </v-btn>
      </v-toolbar>
    </v-card-title>

    <v-card-text>
         <v-data-table dense :headers="headersCitas" :items="citas" :search="search" hide-default-footer :items-per-page="opcionActual">

        <template v-slot:top>
          <v-toolbar flat>
            <v-row>
              <v-col cols="12" sm="3" md="3">
                <v-autocomplete ref="citaForm" no-data-text="Cargando... " :items="especialidades" item-text="nombre"
                  item-value="id" v-model="citaForm.especialidad" dense label="Especialidad" outlined>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                <v-autocomplete ref="citaForm" no-data-text="Cargando... "  :items="modalidades" item-text="nombre" item-value="id"
                v-model="citaForm.modalidad" dense label="Modalidad" outlined>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                <v-autocomplete ref="citaForm" no-data-text="Cargando... "  :items="estados" item-text="nombre" item-value="id" 
                v-model="citaForm.estado" :loading="loading.estados" dense label="Estado" outlined>
                </v-autocomplete>
              </v-col>

              <v-card-actions class="mb-4">
                <v-spacer></v-spacer>
                <v-btn small @click="aplicarFiltro()" color="info">
                  Aplicar filtro <v-icon small right>mdi-filter-variant-plus</v-icon>
                </v-btn>
                <v-btn small @click="limpiarFiltro()" color="error">
                  Limpiar filtros <v-icon small right>mdi-tr</v-icon>
                </v-btn>
              </v-card-actions>
            </v-row>
            <!-- <pre>{{ citas }}</pre> -->
          </v-toolbar>
        </template>

        <template v-slot:[`item.sms`]="{ item }">
          <v-chip small :color="getColor(item.sms)" dark>
            {{ item.sms == "1" ? "Si" : "No" }}
          </v-chip>
        </template>


        <template v-slot:[`item.whatsapp`]="{ item }">
          <v-chip small :color="getColor(item.whatsapp)" dark>
            {{ item.whatsapp == "1" ? "Si" : "No" }}
          </v-chip>
        </template>

        <template v-slot:[`item.requiere_orden`]="{ item }">
          <v-chip small :color="getColor(item.requiere_orden)" dark>
            {{ item.requiere_orden == "1" ? "Si" : "No" }}
          </v-chip>
        </template>
        <template v-slot:[`item.exento`]="{ item }">
          <v-chip small :color="getColor(item.exento)" dark>
            {{ item.exento == "1" ? "Si" : "No" }}
          </v-chip>
        </template>
        <template v-slot:[`item.estado_id`]="{ item }">
          <v-chip small :color="getColor(item.estado_id)" dark>
            {{ item.estado_id == "1" ? "Activo" : "Inactivo" }}
          </v-chip>
        </template>

        <template v-slot:[`item.requiere_firma`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon :color="item.requiere_firma == true ? 'success' : 'error'" v-bind="attrs" v-on="on"
                @click="cambiarRequeireFirma(item)">{{
                  item.requiere_firma == true
                    ? "mdi-toggle-switch-off"
                    : "mdi-toggle-switch"
                }}
              </v-icon>
            </template>

            <span>Cambiar Estado</span>
          </v-tooltip>
        </template>


        <template v-slot:[`item.activo_autogestion`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon :color="item.activo_autogestion == true ? 'success' : 'error'" v-bind="attrs" v-on="on"
                @click="activarCitaAutogestion(item)">{{
                  item.activo_autogestion == true
                    ? "mdi-toggle-switch-off"
                    : "mdi-toggle-switch"
                }}
              </v-icon>
            </template>
          </v-tooltip>
        </template>



        <template v-slot:[`item.historia`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon :color="item.estado_id == true ? 'success' : 'error'" v-bind="attrs" v-on="on"
                @click="cambiarEstado(item)">{{
                  item.estado_id == true
                    ? "mdi-toggle-switch-off"
                    : "mdi-toggle-switch"
                }}
              </v-icon>
            </template>

            <span>Cambiar Estado</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon @click="editarCupsCita(item)" v-on="on" dense color="info">mdi-iv-bag</v-icon>
            </template>
            <span>Relación de CUPS</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon @click="editarCita(item)" v-on="on" dense color="warning">mdi-pencil</v-icon>
            </template>
            <span>Editar cita</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon @click="asignarRepsACita(item)" v-on="on" dense color="primary">mdi-home-switch</v-icon>
            </template>
            <span>Asignar reps a la cita</span>
          </v-tooltip>
          <!-- <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" @click="editorHistoria(item)" dense>mdi-file-document-edit-outline
                </v-icon>
              </template>
              <span>Historia Clínica</span>
            </v-tooltip> -->
        </template>
      </v-data-table>

      <v-row no-gutters style="background-color: white;">
        <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
          <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listarCitas">
          </v-pagination>
        </v-col>
        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
          <v-select class="my-4" v-model="opcionActual" :items="opciones" dense outlined small @change="listarCitas()">
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog v-model="dialogCups" persistent width="1200">
      <v-card>
        <v-alert v-if="citaSeleccionada" dense text border="left" type="info">
          Gestión de cups para la cita de
          {{ this.citaSeleccionada.especialidad.nombre }} -
          <b>{{ this.citaSeleccionada.nombreCita }}</b></v-alert>
        <v-card-text class="pb-0">
          <v-row>
            <v-col cols="12" sm="12" md="11">
              <v-autocomplete v-model="formCups.cup" :items="cups.filter(
                (s) =>
                  !cupsCita
                    .map((item) => parseInt(item.id))
                    .includes(parseInt(s.id))
              )
                " item-text="nombre" label="Listado de cups" item-value="id" return-object dense>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="1">
              <v-btn color="success" dark small class="mt-2" @click="actualizarCup(1, formCups.cup.id)">Agregar</v-btn>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-data-table no-data-text="Sin cups relacionados" :headers="headerCups" :items="cupsCita" dense
                disable-pagination hide-default-footer>
                <template v-slot:[`item.index`]="{ index }">
                  {{ index + 1 }}
                </template>
                <template v-slot:[`item.eliminar`]="{ item, index }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn color="error" icon small v-on="on" @click="actualizarCup(2, item.id, index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small dark @click="dialogCups = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="crearActividad" width="1000" persistent>
      <v-card>
        <v-alert type="info" icon="mdi-calendar-range" text dense border="left">Cita</v-alert>
        <v-card-text class="pb-0">
          <v-form>
            <v-row>
              <v-col cols="12" sm="12" md="5">
                <v-autocomplete outlined dense v-model="cita.especialidade_id" :items="especialidades"
                  :error-messages="erroresActividades.especialidade_id" item-text="nombre" item-value="id"
                  label="Especialidades" required>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="2">
                <v-select outlined dense v-model="cita.tipo_cita_id" :error-messages="erroresActividades.tipo_cita_id"
                  :items="tipoCitas" item-text="nombre" item-value="id" label="Tipo de cita" required>
                </v-select>
              </v-col>

              <v-col cols="12" sm="12" md="2">
                <v-select outlined dense v-model="cita.modalidad_id" :error-messages="erroresActividades.modalidad_id"
                  :items="modalidades" item-text="nombre" item-value="id" label="Modalidad" required>
                </v-select>
              </v-col>

              <v-col cols="12" sm="12" md="3">
                <v-select outlined dense v-model="cita.sms" :items="[
                  { nombre: 'SI', val: true },
                  { nombre: 'NO', val: false },
                ]" :error-messages="erroresActividades.sms" label="Notificacion Mensaje Texto" item-value="val"
                  item-text="nombre" required></v-select>
              </v-col>

              <v-col cols="12" sm="12" md="6">
                <v-text-field outlined dense v-model="cita.nombre" :error-messages="erroresActividades.nombre" label="Nombre" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-text-field outlined dense hide-spin-buttons v-model="cita.cantidad_paciente"
                  :error-messages="erroresActividades.cantidad_paciente" type="number" label="Cantidad paciente"
                  required hint="Campo numérico">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-text-field outlined dense hide-spin-buttons v-model="cita.tiempo_consulta"
                  :error-messages="erroresActividades.tiempo_consulta" placeholder="en minutos" type="number"
                  label="Tiempo consulta" required></v-text-field>
              </v-col>

              <v-col cols="12" sm="12" md="6">
                <v-autocomplete outlined dense v-model="cita.primera_vez_cup_id" :items="cups" label="CUP Primera vez"
                  :item-text="(c) => c.codigo + ' - ' + c.nombre" item-value="id"
                  :error-messages="erroresActividades.primera_vez_cup_id"></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="12" md="6">
                <v-autocomplete outlined dense v-model="cita.control_cup_id" :items="cups" label="CUP control"
                  :item-text="(c) => c.codigo + ' - ' + c.nombre" item-value="id"
                  :error-messages="erroresActividades.control_cup_id"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-autocomplete outlined dense v-model="cita.tipo_historia_id" :items="tipoHistorias"
                  label="Tipo de Historia Clínica" :item-text="(c) => c.nombre" item-value="id"
                  :error-messages="erroresActividades.tipo_historia_id"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-autocomplete outlined dense v-model="cita.tipo_consulta_id" :items="tipoConsultas"
                  label="Tipo de Consulta" :item-text="(c) => c.nombre" item-value="id"
                  :error-messages="erroresActividades.tipo_consulta_id"></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="12" md="6">
                <v-select outlined dense :items="keiron" :error-messages="erroresActividades.whatsapp"
                  v-model="cita.whatsapp" label="Notificacion WhatsApp"></v-select>
              </v-col>

              <v-col cols="12" sm="12" md="6">
                <v-autocomplete outlined dense v-model="cita.entidad_id" :items="entidades" label="Entidad"
                  :item-text="(e) => e.nombre" item-value="id"
                  :error-messages="erroresActividades.entidad_id"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-switch dense v-model="cita.requiere_orden" label="Requiere Ordenamiento"></v-switch>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-switch dense v-model="cita.exento" label="Exento de Cuota Moderadora"></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small dark @click="clearErroresActividades()">Cancelar</v-btn>
          <v-btn v-if="cita.actualizar == false" color="success" small dark @click="guardarCita()">Guardar</v-btn>
          <v-btn v-if="cita.actualizar == true" color="success" small dark
            @click="actualizarCita(cita)">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAsignarRep" max-width="1100px" persistent>
      <asignarRepCita ref="dialogAsignarRepsCita" :citaSeleccionada="citaSeleccionada" @cerrar="dialogAsignarRep = false"></asignarRepCita>
    </v-dialog>
  </v-card>
</template>
<script>
import { listarCitas, crearCita } from "~/api/citas/cita";
import { listarEspecialidad } from "~/api/especialidades/especialidad";
import { listarTipoCitas } from "~/api/tiposCitas/tipoCita";
import { listarTipoCampo } from "~/api/historia/tipoCampo";
import { historiaClinicaCita } from "~/api/citas/cita";
import { guardarCampoHistoria } from "~/api/historia/campoHistoria";
import { guardarCategoriaHistoria } from "~/api/historia/categoriaHistoria";
import { mapActions } from "vuex"
import asignarRepCita from "@/components/citas/AsignarCitasReps/AsignarCitasReps.vue";
export default {
  name: "Citas",
  components: {
    asignarRepCita
  },
  data() {

    return {
      cupsCita: [],
      formCups: {
        cup: null,
      },
      dialogAsignarRep: false,
      dialogCups: false,
      tipoCategorias: [],
      opciones: [5, 10, 20, 50, 100],
      opcionActual: 5,
      pagina: 1,
      total: 0,
      filtro: {
        nombre: "",
      },
      citaForm: {
        especialidad: "",
        modalidad: "",
        estado: "",
      },
      keiron: [
        {
          text: 'Si',
          value: true,
        },
        {
          text: 'No',
          value: false,
        }
      ],
      search: "",
      estados: [],
      modalidades: [],
      plantillas: [],
      dialogPlantilla: false,
      e1: 1,
      datosPrevisualizacion: null,
      dialogPrevisualizar: false,
      cups: [],
      tipoHistorias: [],
      citaSeleccionada: null,
      filtroCicloVida: null,
      preload: false,
      panelCampos: null,
      panelCategorias: null,
      expanded: [],
      expandedPlantilla: [],
      categorias: [],
      dialogHistoria: false,
      crearActividad: false,
      especialidades: [],
      cita: {
        requiere_orden: false,
        nombre: "",
        especialidade_id: "",
        cantidad_paciente: "",
        tiempo_consulta: "",
        sms: "",
        tipo_cita_id: "",
        modalidad_id: null,
        primera_vez_cup_id: null,
        control_cup_id: null,
        tipo_historia_id: "",
        tipo_consulta_id: "",
        entidad_id: "",
        actualizar: false,
        whatsapp: "",
        exento: false,
      },
      cicloVida: ["Primera infancia", "Infancia", "Juventud", "Vejez", "Todos"],
      headerPlantillaCategoria: [
        {
          text: "Nombre",
          align: "start",
          value: "nombre",
          groupable: false,
        },
        {
          text: "Categoria",
          value: "categoria",
          align: "right",
        },
        {
          text: "Tipo",
          value: "tipo_campo_historia.descripcion",
          align: "right",
        },
      ],
      headerPlantillaHistoria: [
        {
          text: "#",
          align: "center",
          value: "id",
        },
        {
          text: "Nombre",
          align: "center",
          value: "nombre",
        },
        {
          text: "",
          value: "data-table-expand",
        },
      ],
      headersCampos: [
        {
          text: "Nombre",
          value: "nombre",
        },
        {
          text: "Tipo",
          value: "tipo_campo_historia.nombre",
        },
        {
          text: "Ciclo Vida",
          value: "ciclo_vida",
        },
        {
          text: "Requerido",
          value: "requerido",
        },
        {
          text: "Orden",
          value: "orden",
        },
      ],
      headersCategoria: [
        {
          text: "Nombre",
          value: "nombre",
        },
        {
          text: "Titulo",
          value: "titulo",
        },
        {
          text: "Orden",
          value: "pivot.orden",
        },
        {
          text: "Previsualizar",
          value: "previsualizar",
        },
        {
          text: "",
          value: "data-table-expand",
        },
      ],
      headerCups: [
        {
          text: "#",
          align: "center",
          sortable: false,
          value: "index",
        },
        {
          text: "Codigo",
          align: "center",
          sortable: false,
          value: "codigo",
        },
        {
          text: "Nombre",
          align: "center",
          sortable: false,
          value: "nombre",
        },
        {
          text: "",
          align: "center",
          sortable: false,
          value: "eliminar",
        },
      ],
      headersCitas: [
        {
          text: "id",
          value: "id",
        },
        {
          text: "Especialidad",
          align: "start",
          sortable: false,
          value: "especialidad.nombre",
        },
        {
          text: "Cita",
          align: "start",
          sortable: false,
          value: "nombreCita",
        },
        {
          text: "Modalidad",
          align: "start",
          sortable: false,
          value: "modalidad.nombre",
        },
        {
          text: "Tipo",
          align: "start",
          sortable: false,
          value: "tipo_cita.nombre",
        },
        {
          text: "Cantidad paciente",
          align: "center",
          sortable: false,
          value: "cantidad_paciente",
        },
        {
          text: "Tiempo consulta",
          align: "center",
          sortable: false,
          value: "tiempo_consulta",
        },
        {
          text: "Notificacion SMS",
          align: "center",
          sortable: false,
          value: "sms",
        },
        {
          text: "Notificacion WhatsApp",
          align: "center",
          sortable: false,
          value: "whatsapp",
        },
        {
          text: "Requiere ordenamiento",
          align: "center",
          sortable: false,
          value: "requiere_orden",
        },
        {
          text: "Exento Cuota Moderadora",
          align: "center",
          sortable: false,
          value: "exento",
        },
        {
          text: "Estado",
          align: "center",
          value: "estado_id",
        },
        {
          text: "Requiere firma",
          align: "center",
          value: "requiere_firma",
        },
        {
          text: "Autogestion",
          align: "center",
          value: "activo_autogestion",
        },
        {
          text: "Acciones",
          align: "center",
          sortable: false,
          value: "historia",
        },

      ],
      opcionesPromedios: [],
      headerPreguntas: [
        {
          text: "Opcion",
          value: "opcion",
        },
        {
          text: "Valor",
          value: "valor",
        },
      ],
      erroresActividades: {
        requiere_orden: "",
        nombre: "",
        especialidade_id: "",
        cantidad_paciente: "",
        tiempo_consulta: "",
        sms: "",
        tipo_cita_id: "",
        modalidad_id: "",
        primera_vez_cup_id: "",
        control_cup_id: "",
        tipo_historia_id: "",
        tipo_consulta_id: "",
        entidad_id: "",
        whatsapp: "",
      },
      citas: [],
      tipoCitas: [],
      tipoCampo: [],
      formCategoria: {
        tipoCategoria: null,
        nombre: null,
        titulo: null,
        editable: false,
        orden: null,
        citas: null,
        requerido: null,
      },
      formCampos: {
        nombre: null,
        tipo: null,
        requrido: false,
        ciclo_vida: null,
        orden: null,
        columnas: null,
        opciones: [],
        subcategoria_id: null,
        predeterminado: null,
      },
      formOpcinesPromedio: {
        opcion: null,
        valor: null,
      },
      tipoConsultas: [],
      entidades: [],
    };
  },

  created() {
    this.listarCitas();
    this.listarTipoCitas();
    this.listarEspecialidad();
    this.listarCups();
    this.listarModalidades();
    this.listarEstados();
    this.listarTipoCategorias();
    this.getTipoHistoria();
    this.getTipoConsultas();
    this.getEntidades();
  },

  methods: {
    ...mapActions('app', ['setPreload']),

    editarCupsCita(item) {
      this.citaSeleccionada = item;
      this.cupsCita = item.cups;
      this.dialogCups = true;
    },

    editarCita(item) {

      this.crearActividad = true;
      this.cita.id = item.id;
      this.cita.nombre = item.nombreCita;
      this.cita.especialidade_id = item.especialidade_id;
      this.cita.cantidad_paciente = item.cantidad_paciente;
      this.cita.tiempo_consulta = item.tiempo_consulta;
      this.cita.sms = item.sms;
      this.cita.sms = item.sms == 1;
      this.cita.requiere_orden = item.requiere_orden == 1;
      this.cita.exento = item.exento == 1;
      this.cita.tipo_cita_id = item.tipo_cita_id;
      this.cita.modalidad_id = item.modalidad_id;
      this.cita.primera_vez_cup_id = item.primera_vez_cup_id;
      this.cita.control_cup_id = item.control_cup_id;
      this.cita.tipo_historia_id = item.tipo_historia_id;
      this.cita.tipo_consulta_id = item.tipo_consulta_id;
      this.cita.entidad_id = item.entidad_id;
      this.cita.whatsapp = item.whatsapp;
      this.cita.actualizar = true;
    },

    actualizarCup(tipo, cup, index = null) {
      this.preload = true;
      const data = {
        tipo: tipo,
        cita: this.citaSeleccionada.id,
        cup: cup,
      };
      this.$axios
        .$post("citas/cups-disponibles", data)
        .then((res) => {
          if (tipo === 1) {
            this.cupsCita.push({
              ...this.formCups.cup,
            });
          } else {
            this.cupsCita.splice(index, 1);
          }
          this.formCups.cup = null;
          this.preload = false;
        })
        .catch((e) => {
          this.preload = false;
        });
    },

    async listarCitas() {
      this.loading = true;
      //   if (this.citaForm) {
      //     this.especialidades = [];
      //   }
      const params = {
        page: this.pagina,
        cant: this.opcionActual,
      };
      try {
        this.setPreload(true);
        const response = await this.$axios.post("/citas/listar", params)
        this.citas = response.data.data;
        this.total = response.data.last_page;
      } catch (error) {
        console.error(error)
      } finally {
        this.setPreload(false);
      }
    },

    limpiar() {
      this.preload = true;
      for (const prop of Object.getOwnPropertyNames(this.filtro)) {
        this.filtro[prop] = null;
      }
      for (const key in this.editedItem) {
        this.editedItem[key] = "";
      }
      this.editedIndex = -1;
      this.dialog = false;
      this.preload = false;
      this.page = 1,
        this.opcionActual = 5;
      this.listarCitas();
    },

    guardarCita() {
      this.$loadingPostRequest(crearCita(), this.cita)
        .then((res) => {
          this.crearActividad = false;
          this.listarCitas();
          this.clearActividad();
          this.clearErroresActividades();
          this.$toast.success("Se ha creado correctamente la actividad");
          window.location.reload();
        })
        .catch((e) => {
          this.erroresActividades = e.response.data.errors;
          this.$toast.error("Ocurrió un error al crear la actividad");
        });
    },

    actualizarCita(item) {
      this.preload = true;
      this.$axios
        .put("/citas/" + item.id, item)
        .then((res) => {
          this.preload = false;
          this.listarCitas();
        })
        .catch((e) => {
          this.preload = false;
          this.erroresActividades = e.response.data.errors;
        });
    },

    clearActividad() {
      for (const key in this.cita) {
        this.cita[key] = "";
      }
    },

    clearErroresActividades() {
      this.crearActividad = false;
      this.clearActividad();
      for (const key in this.erroresActividades) {
        this.erroresActividades[key] = "";
      }
    },

    listarTipoCitas() {
      this.$loadingGetRequest(listarTipoCitas())
        .then((res) => {
          this.tipoCitas = res.data.data.data;
        })
        .catch((e) => {
          console.log(e.response.data);
        });
    },

    listarEspecialidad() {
      this.$loadingGetRequest(listarEspecialidad())
        .then((res) => {
          this.loading = true;
          this.especialidades = res.data;
        })
        .catch((e) => {
          console.log(e.response.data);
        });
    },

    getColor(estado) {
      return estado == 1 ? "green" : "red";
    },

    editorHistoria(item) {
      this.citaSeleccionada = item;
      this.dialogHistoria = true;
      this.categorias = item.categorias;
    },

    listarTipoCampo() {
      this.$loadingGetRequest(listarTipoCampo(0)).then((res) => {
        this.tipoCampo = res.data.data;
      });
    },
    formularioCampos() {
      this.panelCampos = this.panelCampos === null ? 0 : null;
      this.listarTipoCampo();
    },
    guardarCampoHistoria(categoria) {
      let opciones = this.formCampos.opciones.join();
      if (parseInt(categoria.tipo_categoria_historia_id) === 2) {
        this.formCampos.tipo = 12;
        opciones = JSON.stringify(this.formCampos.opciones);
      } else if (parseInt(categoria.tipo_categoria_historia_id) === 3) {
        this.formCampos.tipo = 11;
      }
      const id = this.categorias.findIndex((s) => s.id === categoria.id);
      const ordenColumnas = categoria.campos.filter(
        (s) =>
          parseInt(s.orden) === parseInt(this.formCampos.orden) &&
          s.ciclo_vida === this.filtroCicloVida
      );
      if (ordenColumnas.length > 0) {
        return this.$swal({
          type: "error",
          title: "¡No puede ser!",
          text: "El orden seleccionado ya se encuentra ocupado.",
        });
      }
      this.preload = true;
      const request = {
        nombre: this.formCampos.nombre,
        tipo_campo_id: this.formCampos.tipo,
        requerido: this.formCampos.requrido,
        categoria_historia_id: categoria.id,
        ciclo_vida: this.filtroCicloVida,
        orden: this.formCampos.orden,
        columnas: this.formCampos.columnas,
        opciones: opciones,
        subcategoria_id: this.formCampos.subcategoria_id,
        predeterminado: this.formCampos.predeterminado,
      };

      this.$loadingPostRequest(guardarCampoHistoria(), request)
        .then((res) => {
          this.filtroCicloVida = null;
          this.limpiarCamposHistoria();
          this.panelCampos = null;
          this.categorias[id].campos.push(res.data.data);
          this.preload = false;
          this.filtroCicloVida = res.data.data.ciclo_vida;
        })
        .catch((e) => {
          this.preload = false;
          console.log(e.response);
        });
    },
    guardarCategoriaHistoria() {
      const ordenCategorias = this.categorias.filter(
        (s) => parseInt(s.pivot.orden) === parseInt(this.formCategoria.orden)
      );
      const validarNombre = this.categorias.filter(
        (s) => s.nombre === this.formCategoria.nombre
      );
      if (ordenCategorias.length > 0) {
        return this.$swal({
          type: "error",
          title: "¡No puede ser!",
          text: "El orden seleccionado ya se encuentra ocupado.",
        });
      }
      if (validarNombre.length > 0) {
        return this.$swal({
          type: "error",
          title: "¡No puede ser!",
          text: "El nombre ya se encuentra registrado.",
        });
      }

      this.formCategoria.citas = this.citaSeleccionada.id;
      this.preload = true;

      this.$loadingPostRequest(guardarCategoriaHistoria(), this.formCategoria)
        .then((res) => {
          let categoria = res.data.data;
          categoria.pivot = {};
          categoria.campos = [];
          categoria.pivot.orden = this.formCategoria.orden;
          this.categorias.push(categoria);
          this.panelCategorias = null;
          this.preload = false;
        })
        .catch((e) => {
          this.preload = false;
          console.log(e.response);
        });
    },

    limpiarCamposHistoria() {
      this.formCampos.nombre = null;
      this.formCampos.tipo = null;
      this.formCampos.requrido = false;
      this.formCampos.ciclo_vida = null;
      this.formCampos.orden = null;
      this.formCampos.columnas = null;
      this.formCampos.opciones = [];
      this.formCampos.subcategoria_id = null;
      this.formCategoria.nombre = null;
      this.formCategoria.titulo = null;
      this.formCategoria.editable = false;
      this.formCategoria.orden = null;
      this.formCategoria.citas = null;
    },
    listarCups() {
      this.$axios
        .get("cup?page=0")
        .then((res) => {
          this.cups = res.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    listarModalidades() {
      this.$axios
        .get("modalidad")
        .then((res) => {
          this.modalidades = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    generarPrevisualizacion(categoria) {
      console.log(categoria);
      this.datosPrevisualizacion = categoria;
      this.dialogPrevisualizar = true;
    },
    cargarPlantillas() {
      this.dialogPlantilla = true;
      this.$axios.$get("/citas/plantilla-historia").then((res) => {
        this.plantillas = res;
        console.log(res);
      });
    },
    aplicarHistoria(historia) {
      const data = {
        tipo: 1,
        cita: this.citaSeleccionada.id,
        componente: historia.id,
      };
      this.$axios.$post("/citas/aplicar-plantilla", data).then((res) => {
        this.dialogPlantilla = false;
        this.plantillas = [];
        this.editorHistoria(res);
      });
    },
    aplicarCategoria(categoria, historia) {
      const categoriaInfo = historia.categorias.find(
        (s) => s.nombre === categoria[0].categoria
      );
      const data = {
        tipo: 2,
        cita: this.citaSeleccionada.id,
        componente: parseInt(categoriaInfo.id),
      };
      this.$axios.$post("/citas/aplicar-plantilla", data).then((res) => {
        this.dialogPlantilla = false;
        this.plantillas = [];
        this.editorHistoria(res);
      });
    },
    listarTipoCategorias() {
      this.preload = true;
      this.$axios
        .$get("/categoria-historia/tipocategoria")
        .then((res) => {
          this.tipoCategorias = res;
          this.preload = false;
        })
        .catch((e) => {
          this.preload = false;
        });
    },
    agregarOpcionesPromedio() {
      this.formCampos.tipo = 12;
      this.formCampos.opciones.push({
        ...this.formOpcinesPromedio,
      });
      this.formOpcinesPromedio.opcion = null;
      this.formOpcinesPromedio.valor = null;
    },
    getTipoHistoria() {
      this.$axios
        .$get("/tipo-historia")
        .then((res) => {
          this.tipoHistorias = res;
          // console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getTipoConsultas() {
      this.$axios.$get("/tipo-consultas").then((res) => {
        this.tipoConsultas = res;
      });
    },

    getEntidades() {
      this.$axios.$get("entidad/listar-entidades-usuario").then((res) => {
        this.entidades = res;
      });
    },

    async listarEstados() {
      try {
        const response = await this.$axios.get('estados/listar');
        this.estados = response.data.filter(estados => estados.id == 1 || estados.id == 2);
      } catch (error) {
        this.$toast.error("Ha ocurrido un error al listar los estados");
      }
    },

    async aplicarFiltro() {
      if (!this.citaForm.especialidad && !this.citaForm.modalidad && !this.citaForm.estado) {
        this.$toast.error('¡ Debe seleccionar al menos un filtro de busqueda !');
        return;
      }

      try {
        this.loading = true;
        this.setPreload(true);
        const params = {
          especialidade_id: this.citaForm.especialidad,
          modalidad_id: this.citaForm.modalidad,
          estado_id: this.citaForm.estado,
        };
        const response = await this.$axios.get('citas/filtrarCitas', { params });
        this.citas = response.data;
      } catch (error) {
        this.$toast.error("No se pueden filtar las citas");
      } finally {
        this.setPreload(false);
        this.loading = false;
      }

    },

    limpiarFiltro() {
      this.citaForm = {
        especialidad: "",
        modalidad: "",
        estado: "",
      };
      this.listarCitas()
    },



    cambiarEstado(item) {
      this.preload = true;
      this.$swal({
        title: "Está seguro?",
        text: "Desea cambiar el estado de la Cita",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",

      }).then((result) => {
        if (result.value) {
          this.$axios
            .put(`/citas/cambiarEstado/${item.id}`, {
              'estado_id': item.estado_id == 1 ? 2 : 1,
            })
            .then(() => {
              this.$toast.success("Cambio de estado exitoso");
              this.listarCitas();
            })
            .catch((error) => {
              this.$toast.error("Ocurrió un error al cambiar el estado");
              console.log(error);
            })
            .finally(() => {
              this.preload = false;
            });
        }
      });
    },

    cambiarRequeireFirma(item) {
      this.preload = true;
      this.$swal({
        title: "Está seguro?",
        text: "Desea cambiar el campo requiere firma de la Cita",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",

      }).then((result) => {
        if (result.value) {
          this.$axios
            .put(`/citas/cambiarFirma/${item.id}`, {
              'requiere_firma': item.requiere_firma == true ? false : true,
            })
            .then(() => {
              this.$toast.success("Cambio de estado exitoso");
              if (this.citaForm) {
                this.aplicarFiltro();
              } else {
                this.listarCitas();
              }

            })
            .catch((error) => {
              this.$toast.error("Ocurrió un error al cambiar el estado");
              console.log(error);
            })
            .finally(() => {
              this.preload = false;
            });
        }
      });
    },

    asignarRepsACita(item)
    {
      this.dialogAsignarRep = true;
      this.citaSeleccionada = item;
      this.$nextTick(() => {
        this.$refs.dialogAsignarRepsCita.listarRepsPorCita();
      });
    },

    async activarCitaAutogestion(item) {
      try {
        this.setPreload(true);
        await this.$axios.post(`/citas/activar-autogestion/${item.id}`)
        this.listarCitas();
      } catch (error) {
        this.$toast.error('Ha ocurrido un error al activar la parametrizacion')
      } finally {
        this.setPreload(false);

      }
    }
  },
};
</script>
