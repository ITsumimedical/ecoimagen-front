<template>
  <div>

    <!-- Preload -->
    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Tranquilo procesamos tu solicitud!
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal -->
    <v-dialog v-model="dialog" persistent fullscreen>
      <v-card>
        <!-- <v-alert dense text border="left" icon="mdi-pill" type="info" color="info">

          {{ isEdit ? `Editando el Producto ${producto.nombre}` : 'Crear un nuevo Producto' }}
        </v-alert> -->
        <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
            <span> {{ isEdit ? `Editando el Producto ${producto.nombre}` : 'Crear un nuevo Producto' }}</span>
          </div>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card-title>

    <v-divider></v-divider>
    <v-col></v-col>
    <v-form ref="formNuevoProducto">
        <v-card-text>
          <v-row align-content="stretch">
            <v-col cols="12" sm="6" md="4">
              <v-text-field dense v-model="producto.nombre" label="Nombre *" :rules="requerido">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field dense v-model="producto.codigo" label="Codigo *" :rules="requerido">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field dense v-model="producto.frecuencia" label="Frecuencia (Días) *" required type="number"
                :rules="requerido"></v-text-field>
            </v-col>
          </v-row>

          <v-row align-content="stretch">
            <v-col cols="12" sm="6" md="3">
              <v-autocomplete dense :items="grupos" item-text="nombre" item-value="id" v-model="producto.grupo_id"
                label="Grupo" :rules="requerido"/>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-autocomplete dense :items="lineasBase" item-text="nombre" item-value="id"
                v-model="producto.linea_base_id" label="Línea Base" :rules="requerido"
               />
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-autocomplete dense :items="gruposTerapeuticos" item-text="nombre" item-value="id"
                v-model="producto.grupo_terapeutico_id" label="Grupo Terapéutico *"
                :rules="requerido"/>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-autocomplete dense :items="subgruposTerapeuticos" item-text="nombre" item-value="id"
                v-model="producto.subgrupos_terapeuticos" label="Subgrupo Terapéutico *"
                :rules="requerido"/>
            </v-col>

          </v-row>

          <v-row align-content="stretch">
            <v-col cols="12" sm="6" md="3">
              <v-autocomplete dense :items="unidadesMedida"  :item-text="item => `${item.codigo} - ${item.nombre}`" item-value="id"
                v-model="producto.unidad_medida_id" label="Unidad de Medida *" :rules="requerido"
                required />
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-autocomplete dense :items="unidadesMedidaDispensacion"  :item-text="item => `${item.codigo} - ${item.nombre}`" item-value="id"
                v-model="producto.unidad_medida_dispensacion_id" label="Unidad de Medida Dispensación *" :error-messages="errors.unidad_medida_dispensacion_id"
                required />
            </v-col>

            <v-col cols="12" sm="6" md="3" v-if="verCampos">
                <v-combobox small-chips dense readonly chips multiple label="Vías de administración" :value="viasNombres" @click="abrirDialogoVias(producto)">
                </v-combobox>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-autocomplete dense :items="formasFarmaceuticasFFM" :item-text="item => `${item.codigo} - ${item.nombre}`" item-value="id"
                v-model="producto.ffm_id" label="Forma Farmaceutica-FFM *" required
                :error-messages="errors.ffm_id" />
            </v-col>

          </v-row>

          <v-row align-content="stretch">

            <v-col cols="12" sm="12" md="3">
              <v-text-field dense label="Concentración #1" type="number" v-model="producto.concentracion_1">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field dense label="Concentración #2" type="number" v-model="producto.concentracion_2">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-text-field dense label="Concentración #3" type="number" v-model="producto.concentracion_3">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="3">
              <v-autocomplete dense label="ABC" :items="['A', 'B', 'C']" v-model="producto.abc">
              </v-autocomplete>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-text-field dense v-model="producto.unidad_concentracion" label="Unidad de Concentración">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field dense type="number" v-model="producto.cantidad_maxima_orden" label="Cantidad Máxima Ordenar"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field dense type="number" v-model="producto.cantiad_maxima_orden_dia"
                label="Cantidad Máxima Ordenar por Día" required :error-messages="errors.cantiad_maxima_orden_dia">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-autocomplete dense v-model="producto.nivel_portabilidad" label="Nivel de Portabilidad"
                :items="niveles" :rules="requerido"/>
            </v-col>
        </v-row>
        <v-row align-content="stretch">
              <v-col cols="12" sm="12" md="6">
              <v-autocomplete dense label="Ambito" v-model="producto.ambito" :items="ambitos"
              :rules="requerido">
              </v-autocomplete>
              </v-col>
            <v-col cols="12" sm="10" md="10" class="d-flex align-center" v-if="verCampos">
              <v-autocomplete dense v-model="principiosActivosSeleccionados" label="Principios activos"
                :items="principiosActivos" item-text="nombre" item-value="id" multiple chips deletable-chips
                class="flex-grow-1" :loading="cargandoPrincipiosActivos"></v-autocomplete>
              <v-col cols="12" sm="1" md="1">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on" color="success" @click="agregarPrincipiosActivos()">
                      mdi-plus
                    </v-icon>
                  </template>
                  <span>Agregar principios activos</span>
                </v-tooltip>
              </v-col>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-checkbox label="Control Especial" color="red" v-model="producto.control_especial" hide-details></v-checkbox>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-checkbox label="Critico" color="red" v-model="producto.critico" hide-details></v-checkbox>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-checkbox label="Regulado" color="red" v-model="producto.regulado" hide-details></v-checkbox>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-checkbox label="Activo horus" color="red" v-model="producto.activo_horus" hide-details></v-checkbox>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-checkbox label="Alto costo" color="red" v-model="producto.alto_costo" hide-details></v-checkbox>
            </v-col>
              <v-col cols="12" sm="6" md="3">
              <v-checkbox label="Medicamento vital no disponible" color="red" v-model="producto.medicamento_vital" hide-details> </v-checkbox>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-textarea label="Observación" dense v-model="producto.observacion" counter :rules="rules.observacion" auto-grow></v-textarea>
            </v-col>

            <v-col cols="12" sm="12" md="12" v-if="verCampos">
            <v-form ref="formParametrizacion" lazy-validation>
            <v-col cols="12" sm="12" md="12">
             <v-alert text dense color="blue-grey" border="bottom" icon="mdi-information">
                   <b>Parametrización por entidades</b>
              </v-alert>
            </v-col>
            <v-row>
            <v-col cols="12" sm="4" md="4">
            <v-autocomplete label="Entidades" :rules="campoRequerido" dense outlined :items="entidadesUsuario" v-model="entidad_id" item-text="nombre" item-value="id" multiple chips deletable-chips small-chips
            ></v-autocomplete>
          </v-col>
            <v-col cols="12" sm="4" md="4">
                <v-select label="Requiere autorización" :rules="campoRequerido" v-model="requiere_autorizacion" dense outlined :items="requiereAutorizacion"></v-select>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-autocomplete dense label="Programas" v-model="programas" :items="listaProgramas"
                multiple chips deletable-chips item-text="nombre" item-value="id" outlined>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="4" md="4">
                <v-select label="Requiere mipres" :rules="campoRequerido" v-model="requiere_mipres" dense outlined :items="requiereAutorizacion"></v-select>
            </v-col>

            <v-col cols="12" sm="4" md="4">
              <v-autocomplete dense outlined v-model="producto.nivel_ordenamiento" label="Nivel Ordenamiento" :rules="campoRequerido" :items="niveles"
                required :error-messages="errors.nivel_ordenamiento" />
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-select label="Estado Normativo" :rules="campoRequerido" dense outlined :items="['PBS','NO PBS','EXCLUSION']"
                v-model="producto.estado_normativo"></v-select>
            </v-col>

        </v-row>
            <v-col cols="12" sm="12" md="12" class="d-flex justify-center">
                <v-btn color="success" @click="guardarParametrizacionEntidades()" :loading="loadingParametrizacion">Agregar parametrizacion<v-icon right>mdi-plus-thick</v-icon></v-btn>
            </v-col>
            </v-form>

            <v-data-table :items="parametrizacionCodesumi" :headers="headersParametrizacionEntidades" :loading="loadingParametrizacion">
                <template v-slot:[`item.requiere_autorizacion`]="{ item }">
					<v-chip label :color="item.requiere_autorizacion ? 'green' : 'red'" dark>
                        {{ item.requiere_autorizacion ? 'Si' : 'No' }}
                    </v-chip>
				</template>
                <template v-slot:[`item.requiere_mipres`]="{ item }">
					<v-chip label :color="item.requiere_mipres ? 'green' : 'red'" dark>
                        {{ item.requiere_mipres ? 'Si' : 'No' }}
                    </v-chip>
				</template>
                <template v-slot:[`item.programas`]="{ item }">
                    <div>
                        <template v-if="item.programa_codesumi.length > 0">
                        <v-chip
                            v-for="(programa, index) in item.programa_codesumi"
                            :key="index"
                            class="ma-1"
                            color="primary"
                            dark
                            small
                            label
                            @click="abrirModalActualizarProgramas(item)"
                        >
                            {{ programa.nombre }}
                        </v-chip>
                        </template>

                        <template v-else>
                        <v-chip
                            class="ma-1"
                            color="grey lighten-1"
                            dark
                            small
                            label
                            @click="abrirModalActualizarProgramas(item)"
                            style="cursor: pointer;"
                        >
                            Haz clic para añadir programas
                        </v-chip>
                        </template>
                    </div>
                </template>

                <template v-slot:[`item.acciones`]="{ item }">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
								@click="abrirDialogParametrizacion(item)">
								mdi-pencil
							</v-icon>
						</template>
						<span>Editar</span>
					</v-tooltip>
				</template>
            </v-data-table>
        </v-col>

          </v-row>
        </v-card-text>
      </v-form>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="red" dark @click="close">Cancelar
            <v-icon right>mdi-close-circle-outline</v-icon>
          </v-btn>
          <v-btn small color="success" dark @click="save">Guardar
            <v-icon right>mdi-content-save</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog max-width="900px" v-model="editarParametrizacion">
        <v-card>
            <v-alert text dense color="blue-grey" border="bottom" icon="mdi-update"><b>Editar parametrización</b></v-alert>
            <v-card-text>
                <v-row>
                <v-col cols="12" sm="6" md="6">
                    <v-autocomplete label="Entidad" v-model="dataEditarParametrizacion.entidad_id" dense outlined :items="entidadesUsuario" item-text="nombre" item-value="id"></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                <v-select label="Requiere autorización" v-model="dataEditarParametrizacion.requiere_autorizacion" dense outlined :items="requiereAutorizacion"></v-select>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-autocomplete dense outlined v-model="dataEditarParametrizacion.nivel_ordenamiento" label="Nivel Ordenamiento" :items="niveles" />
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-select label="Estado Normativo"  dense outlined :items="['PBS','NO PBS','EXCLUSION']"
                v-model="dataEditarParametrizacion.estado_normativo"></v-select>
            </v-col>
            <v-col cols="12" sm="4" md="4">
                <v-select label="Requiere mipres" v-model="dataEditarParametrizacion.requiere_mipres" dense outlined :items="requiereAutorizacion"></v-select>
            </v-col>
            </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" small @click="actualizarParametrización()" :loading="loadingActualizarParametrizacion">Actualizar<v-icon right>mdi-update</v-icon></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog max-width="900px" v-model="modalEditarProgramas" persistent>
        <v-card>
            <v-alert text dense color="blue-grey" border="bottom" class="text-center">
                <b>AÑADIR O ELIMINAR PROGRAMAS</b>
            </v-alert>
            <v-card-text>
                <v-autocomplete
                    dense
                    label="Programas"
                    v-model="editarProgramas"
                    :items="listaProgramas"
                    multiple
                    chips
                    deletable-chips
                    item-text="nombre"
                    item-value="id"
                    outlined
                ></v-autocomplete>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="modalEditarProgramas = false">Cerrar<v-icon right>mdi-close</v-icon></v-btn>
                <v-btn color="success" small @click="agregarProgramasParametrizacion(idEditarPrograma, editarProgramas)" :loading="cargandoProgramas">Agregar programas<v-icon right>mdi-check-circle-outline</v-icon></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog max-width="1000px" v-model="dialogoAgregarPrincipiosActivos" persistent>
        <v-card>
            <v-alert text dense color="primary" border="bottom" icon="mdi-pill">
                Agregar vías de administración al producto <b>{{ dataViaAdministracion.codigo }} - {{ dataViaAdministracion.nombre }}</b>
            </v-alert>
            <v-card-text>
                <v-col cols="12" sm="12" md="12">
                    <v-autocomplete label="Vías de administración" v-model="vias_administracion_codesumis" dense outlined small-chips multiple chips deletable-chips :items="viasAdministracion" :loading="loadingViasAdministracion" item-text="nombre" item-value="id"></v-autocomplete>
                </v-col>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="cerrarDialogoViasAdministracion()">cerrar<v-icon right>mdi-close</v-icon></v-btn>
                <v-btn color="success" small @click="agregarViasAdministracionProducto()" :loading="loadingViasAdministracion">Agregar<v-icon right>mdi-plus</v-icon></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      editData: {
        type: Object,
        default: () => ({})
      },
      verCampos: {
        type: Boolean,
        default: true,
      }
    },
    mounted() {
      this.listarGrupos();
      this.listarLineasBase();
      this.listarGruposTerapeuticos();
      this.listarSubgruposTerapeuticos();
      this.listarFormasFarmaceuticas();
      this.listarViasAdministracion();
      this.listarProgramas();
      this.listarEntidades();
      this.listarUnidadesMedida();
      this.listarUnidadesMedidaDispensacion();
      this.listarFormasFarmaceuticasFFM();
    },
    data() {
      return {
        listaProgramas: [],
        unidadesMedidaDispensacion: [],
        formasFarmaceuticasFFM: [],
        ambitos: ['AMBULATORIO', 'HOSPITALARIO', 'AMBOS'],
        preload: false,
        programas: [],
        dialog: this.value,
        producto: this.getInitialProducto(),
        dialogoAgregarPrincipiosActivos: false,
        dataViaAdministracion: {},
        vias_administracion_codesumis: [],
        principiosActivosSeleccionados: [],
        loadingViasAdministracion: false,
        isEdit: false,
        principiosActivos: [],
        cargandoPrincipiosActivos: false,
        entidad_id: null,
        requiere_autorizacion: null,
        loadingParametrizacion: false,
        requiere_mipres: null,
        parametrizacionCodesumi: [],
        editarParametrizacion: false,
        dataEditarParametrizacion: {},
        loadingActualizarParametrizacion: false,
        editarProgramas: [],
        modalEditarProgramas: false,
        idEditarPrograma: null,
        cargandoProgramas: false,
        headersParametrizacionEntidades: [
            {
                text: 'Entidad',
                value: 'entidad.nombre'
            },
            {
                text: 'Requiere autorización',
                value: 'requiere_autorizacion'
            },
            {
                text: 'Requiere mipres',
                value: 'requiere_mipres'
            },
            {
                text: 'Nivel de ordenamiento',
                value: 'nivel_ordenamiento'
            },
            {
                text: 'Estado normativo',
                value: 'estado_normativo'
            },
            {
                text: 'Programas asociados',
                value: 'programas'
            },
            {
                text: 'Acciones',
                value: 'acciones'
            }
        ],
        tiposProductos: [
          'MEDICAMENTO',
          'SUMINISTROS',
          'OTRO'
        ],
        grupos: [],
        lineasBase: [],
        gruposTerapeuticos: [],
        subgruposTerapeuticos: [],
        entidadesUsuario: [],
        unidadesMedida: [],
        formasFarmaceuticas: [],
        viasAdministracion: [],
        campoRequerido: [
        v => v !== null && v !== undefined && v !== '' || 'Este campo es requerido',
        ],
        rules: {
                obligatorio: [(v) => !!v || "Este campo es requerido"],
                noNegativo: [(v) => v > 0 || "Este campo debe ser mayor a 0"],
                observacion: [
                    (v) => !!v || "La observación es requerida",
                    (v) =>
                        (v && v.length <= 100) ||
                        "La observación debe ser de máximo 100 caracteres",
                ],
        },
        requiereAutorizacion: [{
            text: 'Si',
            value: true
          },
          {
            text: 'No',
            value: false
          }
        ],
        niveles: ['0', '1', '2', '3', '4'],
        ambitos: ['AMBULATORIO', 'HOSPITALARIO', 'AMBOS'],
        errors: {
          nombre: '',
          codigo: '',
          frecuencia: '',
          tipo_codesumi: '',
          grupo_terapeutico: '',
          subgrupo_terapeutico: '',
          unidad_medida_id: '',
          forma_farmaceutica_id: '',
          vias_administracion: '',
          cantidad_maxima_orden: '',
          cantiad_maxima_orden_dia: '',
          requiere_autorizacion: '',
          nivel_ordenamiento: '',
          unidad_medida_dispensacion_id: '',
          ffm_id: ''
        },
        requerido: [
        v => !!v || 'Este Campo es Requerido *'
      ],
      };
    },
    watch: {
      value(val) {
        this.dialog = val;
      },
      dialog(val) {
        this.$emit('input', val);
        if (!val) {
          this.resetForm();
        }
      },
      editData(val) {
        this.producto = {
          ...val
        };
        this.isEdit = !!val.id;
      }
    },
    computed: {
        viasNombres() {
            return this.editData.vias_administracion?.map(via => via.nombre);
        }
    },
    methods: {
      getInitialProducto() {
        return {
          codigo: '',
          nombre: '',
          frecuencia: '',
          tipo_codesumi: '',
          grupo_id: '',
          linea_base_id: '',
          grupo_terapeutico_id: '',
          subgrupos_terapeuticos: '',
          unidad_medida_id: '',
          forma_farmaceutica_id: '',
          via: '',
          unidad_concentracion: '',
          cantidad_maxima_orden: '',
          cantidad_maxima_orden_dia: '',
          requiere_autorizacion: '',
          nivel_ordenamiento: '',
          nivel_portabilidad: '',
          ambito: '',
          concentracion_1: '',
          concentracion_2: '',
          concentracion_3: '',
          abc: '',
          estado_normativo: '',
          unidad_medida_dispensacion_id: '',
          ffm_id: '',
          control_especial: false,
          critico: false,
          regulado: false,
          activo_horus: false,
          medicamento_vital: false,
          alto_costo: false,
          observacion: '',
        };
      },
      resetForm() {
        this.producto = this.getInitialProducto();
        this.isEdit = false;
      },
      close() {
        this.dialog = false;
        this.limpiarFormularioParametrizacion();
        this.limpiarValidacion();
      },
     save() {
        if(!this.$refs.formNuevoProducto.validate())return;
        this.limpiarErrores();
        this.$emit('save', this.producto);

        this.$swal({
            title: 'Señor Usuario',
            text: 'Recuerde Parametrizar: Vía de administración del medicamento, Entidades y Principios Activos',
            type: 'info'
          });
      },
      listarGrupos() {
        this.$axios.get('/grupos/listar').then(res => {
          this.grupos = res.data;
        }).catch(() => {
          this.$toast.error('Error al listar los grupos');
        }).finally(() => {
          this.preload = false;
        });
      },
      listarLineasBase() {
        this.$axios.get('/lineas-bases/listar')
          .then(res => {
            this.lineasBase = res.data;
          })
          .catch(error => {
            this.$toast.error(error.response.data.mensaje);
          });
      },
      listarGruposTerapeuticos() {
        this.$axios.get('/grupos-terapeuticos/listar')
          .then(res => {
            this.gruposTerapeuticos = res.data;
          })
          .catch(error => {
            this.$toast.error(error.response.data.mensaje);
          });
      },
      listarSubgruposTerapeuticos() {
        this.$axios.get('/subgrupos-terapeuticos/listar')
          .then(res => {
            this.subgruposTerapeuticos = res.data;
          })
          .catch(error => {
            this.$toast.error(error.response.data.mensaje);
          });
      },
      listarFormasFarmaceuticas() {
        this.$axios.get('/formas-farmaceuticas/listar').then(res => {
          this.formasFarmaceuticas = res.data;
        }).catch(() => {
          this.$toast.error('Error al listar las formas farmacéuticas');
        });
      },
      listarViasAdministracion() {
        this.$axios.get('/vias-administracion/listar').then(res => {
          this.viasAdministracion = res.data;
        }).catch(() => {
          this.$toast.error('Error al listar las vías de administración');
        });
      },
      limpiarErrores() {
        this.errors = {}
      },

      listarProgramas() {
        this.$axios.get('/programa-farmacia/listar').then(res => {
          this.listaProgramas = res.data
        }).catch(error => {});
      },

      async listarPrincipiosActivos() {
        this.cargandoPrincipiosActivos = true;

        try {
          // Obtenemos el listado de principios activos generales
          const principiosActivoslistado = await this.$axios.get('principios-activos/listar');
          const principiosGenerales = principiosActivoslistado.data;

          // Luego, obtenemos los principios activos asociados al codesumi
          const principiosActivosAsociados = await this.$axios.post('codesumis/listarPrincipiosAsociados/' + this.editData.id);
          const principiosAsociados = principiosActivosAsociados.data;

          // Ahora combinamos todos los principios activos con los asociados
          // Marcamos los principios asociados como seleccionados
          this.principiosActivos = principiosGenerales.map(principio => ({
            ...principio,
            seleccionados: principiosAsociados.some(asociado => asociado.id === principio.id)
          }));

          // Establecemos los principios activos seleccionados
          this.principiosActivosSeleccionados = principiosAsociados.map(principio => principio.id);

        } catch (error) {
          this.$toast.error('Error al listar los principios activos');
          console.error(error);
        } finally {
          this.cargandoPrincipiosActivos = false;
        }
      },


      agregarPrincipiosActivos() {
        this.$axios.post('codesumis/sincronizarPrincipios', {
          codesumi_id: this.editData.id,
          principio_activo_id: this.principiosActivosSeleccionados
        }).then(() => {
          this.$toast.success('Agregado con éxito')
        }).catch((error) => {
          console.log(error)
        })
      },

      listarEntidades() {
        this.$axios.get('entidad/listar-entidades-usuario').then((res) => {
            this.entidadesUsuario = res.data
        }).catch((error) => {
            console.log(error.response.data.error)
        })
      },

      guardarParametrizacionEntidades() {
        if(!this.$refs.formParametrizacion.validate()) {
            return
        }
        const data = {
            codesumi_id: this.editData.id,
            entidad_id: this.entidad_id,
            requiere_autorizacion: this.requiere_autorizacion,
            nivel_ordenamiento: this.producto.nivel_ordenamiento,
            abc: this.producto.abc,
            estado_normativo: this.producto.estado_normativo,
            programas: this.programas,
            requiere_mipres: this.requiere_mipres
        };
        this.loadingParametrizacion = true;
        this.$axios.post('codesumi-entidad/crear-parametrizacion-codesumi', data).then((res) => {
            this.$toast.success('Parametrización guardada con éxito');
            this.limpiarFormularioParametrizacion();
            this.listarParametrizacionesCodesumi()
        }).catch((error) => {
            console.log(error.response.data.error)
        }).finally(() => {
            this.loadingParametrizacion = false;
        })
      },

      listarParametrizacionesCodesumi(){
        this.loadingParametrizacion = true;
        this.$axios.get('codesumi-entidad/listar-parametrizacion-codesumi/' + this.editData.id).then((res) => {
            this.parametrizacionCodesumi = res.data;
        }).catch((error) => {
            console.log(error.response.data.error)
        }).finally(() => {
            this.loadingParametrizacion = false;
        })
      },

      limpiarFormularioParametrizacion() {
        this.entidad_id = '',
        this.requiere_autorizacion = '',
        this.producto.abc = '',
        this.producto.estado_normativo = '',
        this.producto.nivel_ordenamiento = '',
        this.programas = [],
        this.requiere_mipres = null,
        this.$refs.formParametrizacion?.resetValidation();
      },

      abrirDialogParametrizacion(item) {
        this.dataEditarParametrizacion = {...item}
        this.editarParametrizacion = true;
      },

      abrirModalActualizarProgramas(item) {
        this.editarProgramas = item.programa_codesumi.map(programa => programa.id);
        this.idEditarPrograma = item.id
        this.modalEditarProgramas = true;
      },

      actualizarParametrización() {
        const data = {
            codesumi_id: this.dataEditarParametrizacion.codesumi_id,
            entidad_id: this.dataEditarParametrizacion.entidad_id,
            requiere_autorizacion: this.dataEditarParametrizacion.requiere_autorizacion,
            nivel_ordenamiento: this.dataEditarParametrizacion.nivel_ordenamiento,
            abc: this.dataEditarParametrizacion.abc,
            estado_normativo: this.dataEditarParametrizacion.estado_normativo,
            requiere_mipres: this.dataEditarParametrizacion.requiere_mipres,
            medicamento_vital: this.dataEditarParametrizacion.medicamento_vital
        }
        this.loadingActualizarParametrizacion = true;
        this.$axios.put('codesumi-entidad/actualizar-parametrizacion-codesumi/' + this.dataEditarParametrizacion.id, data).then((res) => {
            this.$toast.success('Parametrización actualizada con éxito');
            this.listarParametrizacionesCodesumi();
            this.editarParametrizacion = false;
        }).catch((error) => {
            console.log(error.response.data.error)
        }).finally(() => {
            this.loadingActualizarParametrizacion = false
        })
      },

      agregarProgramasParametrizacion(idEditarPrograma,editarProgramas){
        this.cargandoProgramas = true;
        this.$axios.post('codesumi-entidad/agregar-programas-codesumi-entidad/' + idEditarPrograma, {
            programas: editarProgramas
        }).then(() => {
            this.$toast.success('Programas agregados con éxito');
            this.modalEditarProgramas = false,
            this.listarParametrizacionesCodesumi()
        }).catch((error) => {
            console.log(error.response.data.error)
        }).finally(() => {
            this.cargandoProgramas = false
        })
      },

      abrirDialogoVias(item) {
        this.vias_administracion_codesumis = item.vias_administracion?.map(programa => programa.id);
        this.dataViaAdministracion = item
        this.dialogoAgregarPrincipiosActivos = true;
      },

      agregarViasAdministracionProducto() {
        this.loadingViasAdministracion = true;
        const data = {
            vias_administracion_id: this.vias_administracion_codesumis,
            codesumi_id: this.dataViaAdministracion.id
        }
        this.$axios.post('codesumis/agregar-vias-administracion-codesumi', data).then((res) => {
            this.$toast.success('Vías de administración agregadas con éxito');
            this.cerrarDialogoViasAdministracion();
            this.close();
            this.$emit('vias-administracion-agregadas');
        }).catch((error) => {
            console.log(error.response.data.error)
        }).finally(() => {
            this.loadingViasAdministracion = false;
        })
      },

      cerrarDialogoViasAdministracion() {
        this.dialogoAgregarPrincipiosActivos = false;
        this.vias_administracion_codesumis = []
      },
      limpiarValidacion(){
        this.$refs.formNuevoProducto?.resetValidation();
      },
      listarUnidadesMedida() {
        this.$axios.get('unidades-medidas-medicamentos/listar').then((res) => {
            this.unidadesMedida = res.data
        }).catch((error) => {
            console.log(error.response.data.error)
        })
      },

      listarUnidadesMedidaDispensacion() {
        this.$axios.get('unidades-medidas-medicamentos-dispensacion/listar').then((res) => {
            this.unidadesMedidaDispensacion = res.data
        }).catch((error) => {
            console.log(error.response.data.error)
        })
      },

      listarFormasFarmaceuticasFFM() {
        this.$axios.get('forma-farmaceutica-ffm/listar').then((res) => {
            this.formasFarmaceuticasFFM = res.data
        }).catch((error) => {
            console.log(error.response.data.error)
        })
      }

    }
  };

</script>
