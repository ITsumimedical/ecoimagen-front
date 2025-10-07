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

    <!-- Filtro y Botones -->

    <v-container fluid>
      <v-row dense>
        <v-col md="4" sm="4" cols="12">
          <v-text-field label="Buscar código" dense outlined v-model="filtro.codigo" />
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-text-field label="Buscar producto" dense outlined v-model="filtro.producto" />
        </v-col>
        <v-col md="4" sm="4" cols="12" class="pa-2">
          <v-btn small color="info" dark @click="listarProductos()">Buscar
            <v-icon right>mdi-magnify</v-icon>
          </v-btn>
          <v-btn small color="warning" dark @click="limpiarFiltro()">Limpiar
            <v-icon right>mdi-close-circle-outline</v-icon>
          </v-btn>
          <v-btn small color="success" dark @click="openModalProducto()">Crear
            <v-icon right>mdi-plus-circle-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>



    <!-- Tabla -->
    <v-data-table :headers="headers" :items="productos" class="elevation-1" :loading="loading" show-expand item-key="id"
      no-data-text="Sin datos para mostrar" hide-default-footer disable-pagination loading-text="Cargando...">
      <!-- Sub Tabla (Medicamentos) -->
      <template v-slot:expanded-item="{ item }">
        <td class="pt-4 pb-4 elevation-0" colspan="12">
          <v-data-table :headers="subHeaders" dense no-data-text="Sin datos para mostrar" :loading="loading"
            loading-text="Cargando..." :items="item.medicamentos">
            <!-- Transformaciones de Campos y Acciones Sub Tabla -->
            <template v-slot:[`item.estado_id`]="{ item: medicamento }">
              <v-chip small :color="medicamento.estado_id === 1 ? 'success' : 'error'" dark>
                {{ medicamento.estado_id === 1 ? 'Activo' : 'Inactivo' }}
              </v-chip>
            </template>
            <template v-slot:[`item.titular`]="{ item: medicamento }">
              {{ medicamento.invima === null ? '':medicamento.invima.titular }}
            </template>
            <template v-slot:[`item.estados`]="{ item: medicamento }">
              <v-chip small
                :color="medicamento.invima === null? 'error':medicamento.invima.estado_registro === 'Vigente' ? 'success' : 'error'"
                dark>
                {{ medicamento.invima === null ? 'No Existe':medicamento.invima.estado_registro === 'Vigente' ? 'Vigente' : 'En Trámite de Renovación' }}
              </v-chip>
            </template>
            <template v-slot:[`item.acciones`]="{ item: medicamento }">
              <div class="d-flex justify-center gx-4">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="mr-2" color="warning" v-bind="attrs" v-on="on" @click="editMedicamento(medicamento)">
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>Editar Medicamento</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="info" v-bind="attrs" v-on="on" @click="editarPrecio(medicamento)">
                      mdi-cash
                    </v-icon>
                  </template>
                  <span>Precio Medicamento</span>
                </v-tooltip>
              </div>
            </template>
            <template v-slot:[`item.masAcciones`]="{ item: medicamento }">
              <div class="d-flex justify-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="error" v-bind="attrs" v-on="on" @click="cambiarEstadoMedicamento(medicamento)">
                      mdi-power</v-icon>
                  </template>
                  <span>{{ medicamento.estado_id === '1' ? 'Inactivar Medicamento' : 'Activar Medicamento' }}</span>
                </v-tooltip>
              </div>
            </template>
          </v-data-table>
        </td>
      </template>
      <template v-slot:[`item.estado.id`]="{ item }">
        <v-chip small :color="item.estado.id === 1 ? 'success' : 'error'" dark>
          {{ item.estado.id === 1 ? 'Activo' : 'Inactivo' }}</v-chip>
      </template>
      <template v-slot:[`item.requiere_autorizacion`]="{ item }">
        {{ item.requiere_autorizacion === '1' ? 'Si' : 'No' }}
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <div class="d-flex justify-center">
          <v-tooltip bottom class="mx-2">
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="warning" v-bind="attrs" v-on="on" @click="editProducto(item)">
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar Producto</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="info" v-bind="attrs" v-on="on" @click="openModalCrearMedicamento(item)">
                mdi-medication
              </v-icon>
            </template>
            <span>Crear Medicamento</span>
          </v-tooltip>
        </div>
      </template>
      <template v-slot:[`item.masAcciones`]="{ item }">
        <div class="d-flex justify-center">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="error" v-bind="attrs" v-on="on" @click="cambiarEstadoProducto(item)">
                mdi-power
              </v-icon>
            </template>
            <span>{{ item.estado.id === 1 ? 'Inactivar Producto' : 'Activar Producto' }}</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>

    <!-- Paginacion -->
    <v-row no-gutters>
      <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listarProductos()">
        </v-pagination>
      </v-col>
      <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small @change="listarProductos()">
        </v-select>
      </v-col>
    </v-row>

    <!-- Modal para Crear/Editar Producto -->
    <modalProducto v-model="dialogProducto" :editData="productoActual" :verCampos="condicionCampos" @save="guardarProducto" ref="dialogModalProducto" @vias-administracion-agregadas="listarProductos()" ></modalProducto>

    <!-- Modal para Crear/Editar Medicamento -->
    <modalMedicamento v-model="dialogMedicamento" :editData="medicamentoActual" @save="guardarMedicamento">
    </modalMedicamento>


    <v-dialog v-model="modalPrecio" max-width="1300" persistent v-if="modalPrecio">
      <v-card>
        <v-alert dense text outlined color="info" icon="mdi-pill-multiple"><b>Precio</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="6" sm="6" md="6">
              <v-text-field dense label="Precio maximo" v-model="precio_maximo" readonly outlined>
              </v-text-field>
            </v-col>
             <v-col cols="6" sm="6" md="6">
              <v-text-field dense label="Costo promedio"  readonly outlined>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete no-data-text="Digite el nombre del prestador para inciar la búsqueda"
                :search-input.sync="prestador" dense v-model="formularioPrecio.rep_id" :items="listaPrestadores"
                item-text="nombre" item-value="id" label="Proveedor*">
              </v-autocomplete>
            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-text-field dense label="Subtotal" v-model="formularioPrecio.precio_unidad" type="number">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="2">
              <v-select label="IVA" v-model="formularioPrecio.iva" :items="['0','7','9','19']" dense></v-select>
            </v-col>

            <v-col cols="12" sm="4" md="3">

              <v-text-field dense label="Total" v-model="formularioPrecio.total" readonly>

              </v-text-field>
            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-text-field dense label="Precio maximo" v-model="formularioPrecio.precio_maximo" type="number">
              </v-text-field>
            </v-col>
            <v-col cols="1" sm="1" md="1">
              <v-btn small color="success" @click="agregarPrecio()" dark>Agregar</v-btn>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-data-table :headers="headersPrecio" :items="listaPrecioMedicamneto" dense>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="warning" class="mr-2 d-inline-block" v-bind="attrs" v-on="on"
                        @click="editarPrecioMedicamento(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Editar</span>
                  </v-tooltip>

                </template>
                <template v-slot:[`item.precio_unidad`]="{ item }">
                  <td>{{Math.trunc(item.precio_unidad)}}</td>
                </template>
                <template v-slot:[`item.iva`]="{ item }">
                  <td>{{Math.trunc(item.iva)}}</td>
                </template>
                <template v-slot:[`item.total`]="{ item }">
                  <td>{{Math.trunc(item.total)}}</td>
                </template>
                <template v-slot:[`item.precio_maximo`]="{ item }">
                  <td>{{Math.trunc(item.precio_maximo)}}</td>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

        </v-card-actions>
      </v-card>
      <v-card>
        <v-alert dense text outlined color="info" icon="mdi-pill-multiple"><b>Tarifa de venta</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete dense v-model="formularioEntidad.entidad_id" :items="entidades" item-text="nombre"
                item-value="id" label="Entidades*">
              </v-autocomplete>
            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-text-field dense label="Subtotal" v-model="formularioEntidad.subtotal" type="number">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="2">

              <v-select label="IVA" v-model="formularioEntidad.iva" :items="['0','7','9','19']" dense></v-select>
            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-text-field dense label="Total" v-model="formularioEntidad.total" readonly>

              </v-text-field>
            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-text-field dense label="Precio maximo" v-model="formularioEntidad.precio_maximo" type="number">
              </v-text-field>
            </v-col>
            <v-col cols="1" sm="1" md="1">
              <v-btn small color="success" @click="agregarTarifa()" dark>Agregar</v-btn>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-data-table :headers="headersEntidad" :items="listaPrecioEntidad" dense>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="warning" class="mr-2 d-inline-block" v-bind="attrs" v-on="on"
                        @click="editarPrecioEntidad(item)">
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>Editar</span>
                  </v-tooltip>

                </template>
                <template v-slot:[`item.subtotal`]="{ item }">
                  <td>{{Math.trunc(item.subtotal)}}</td>
                </template>
                <template v-slot:[`item.total`]="{ item }">
                  <td>{{Math.trunc(item.total)}}</td>
                </template>
                <template v-slot:[`item.iva`]="{ item }">
                  <td>{{Math.trunc(item.iva)}}</td>
                </template>
                <template v-slot:[`item.precio_maximo`]="{ item }">
                  <td>{{Math.trunc(item.precio_maximo)}}</td>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="red" @click="modalPrecio = false" dark>Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalPrecioEditar" max-width="1300" persistent v-if="modalPrecioEditar">
      <v-card>
        <v-alert dense text outlined color="info" icon="mdi-pill-multiple"><b>Editar Precio</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete no-data-text="Digite el nombre del prestador para inciar la búsqueda"
                :search-input.sync="prestador" dense v-model="formularioPrecioEditar.rep_id" :items="listaPrestadores"
                item-text="nombre" item-value="id" label="Proveedor*">
              </v-autocomplete>
            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-text-field dense label="Precio unidad" v-model="formularioPrecioEditar.precio_unidad" type="number">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="2">
              <v-select label="IVA" v-model="formularioPrecioEditar.iva" :items="['0','7','9','19']" dense></v-select>
            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-text-field dense label="Total" v-model="formularioPrecioEditar.total" type="number">
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-text-field dense label="Precio maximo" v-model="formularioPrecioEditar.precio_maximo" type="number">
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="red" @click="modalPrecioEditar = false" dark>Cerrar</v-btn>
          <v-btn small color="orange" @click="actualizarPrecio()" dark>Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modalPrecioEditarEntidad" max-width="1300" persistent v-if="modalPrecioEditarEntidad">
      <v-card>
        <v-alert dense text outlined color="info" icon="mdi-pill-multiple"><b>Editar Precio</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete dense v-model="formularioPrecioEditarEntidad.entidad_id" :items="entidades"
                item-text="nombre" item-value="id" label="Entidades*">
              </v-autocomplete>
            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-text-field dense label="Subtotal" v-model="formularioPrecioEditarEntidad.subtotal" type="number">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4" md="2">

              <v-select label="IVA" v-model="formularioPrecioEditarEntidad.iva" :items="['0','7','9','19']" dense>
              </v-select>

            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-text-field dense label="Total" v-model="formularioPrecioEditarEntidad.total" type="number">
              </v-text-field>
            </v-col>

            <v-col cols="12" sm="4" md="3">
              <v-text-field dense label="Precio maximo" v-model="formularioPrecioEditarEntidad.precio_maximo"
                type="number">
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="red" @click="modalPrecioEditarEntidad = false" dark>Cerrar</v-btn>
          <v-btn small color="orange" @click="actualizarPrecioEntidad()" dark>Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import modalProducto from '@/components/farmacia/productos/modalProducto.vue';
  import modalMedicamento from '@/components/farmacia/productos/modalMedicamento.vue';

  export default {
    components: {
      modalProducto,
      modalMedicamento,
    },
    data() {
      return {
        preload: false,
        loading: false,
        filtro: {
          codigo: null,
          producto: null,
        },
        dialogProducto: false,
        dialogMedicamento: false,
        dialogPrecioMedicamento: false,
        productoActual: {},
        medicamentoActual: {},
        entidades: [],
        listaPrecioEntidad: [],
        headers: [{
            text: 'Código',
			sortable: true,
            value: 'codigo'
          },
          {
            text: 'Producto',
			sortable: true,
            value: 'nombre'
          },
          {
            text: 'Cant. Max. Ordenar',
			sortable: true,
            value: 'cantidad_maxima_orden'
          },
          // {
          //   text: 'Nivel de Ordenamiento',
			// sortable: false,
          //   value: 'nivel_ordenamiento'
          // },
          // {
          //   text: 'Nivel Portabilidad',
			// sortable: false,
          //   value: 'nivel_portabilidad'
          // },
          // {
          //   text: 'Requiere Autorización',
			// sortable: false,
          //   value: 'requiere_autorizacion'
          // },
          {
            text: 'Formas Farmacéuticas',
			sortable: true,
            value: 'forma_farmaceutica.nombre'
          },
          {
            text: 'Ámbito',
			sortable: true,
            value: 'ambito'
          },
          {
            text: 'Estado',
			sortable: true,
            value: 'estado.id'
          },
          {
            text: 'Acciones',
            value: 'acciones',
            sortable: false
          },
          {
            text: 'Más',
            value: 'masAcciones',
            sortable: false
          }
        ],
        subHeaders: [{
            text: 'ID',
			sortable: false,
            value: 'id'
          },
          {
            text: 'Código',
			sortable: false,
            value: 'codigo_medicamento'
          },
          {
            text: 'CUM',
			sortable: false,
            value: 'cum'
          },
          {
            text: 'Titular',
			sortable: false,
            value: 'titular'
          },
          {
            text: 'Estado Registro',
			sortable: false,
            value: 'estados'
          },
          {
            text: 'Estado',
			sortable: false,
            value: 'estado_id'
          },
          {
            text: 'Acciones',
            value: 'acciones',
            sortable: false,
            align: 'center'
          },
          {
            text: 'Más',
            value: 'masAcciones',
            sortable: false,
            align: 'center'
          }
        ],
        productos: [],
        opciones: [10, 15, 20, 50, 100],
        opcionActual: 10,
        pagina: 1,
        total: 0,
        formularioPrecioEditar: {

        },
        modalPrecioEditar: false,
        precio_maximo: '',
        modalPrecio: false,
        formularioPrecio: {},
        listaPrecioMedicamneto: [],
        listaPrestadores: [],
        prestador: '',
        condicionCampos: false,
        headersPrecio: [{
            text: "id",
            align: 'left',
			sortable: false,
            value: 'id'
          },
          {
            text: "Precio unidad",
			sortable: false,
            align: 'left',
            value: 'precio_unidad'
          },
          {
            text: "IVA",
			sortable: false,
            align: 'left',
            value: 'iva'
          },
          {
            text: "Total",
			sortable: false,
            align: 'left',
            value: 'total'
          },
          {
            text: "Precio maximo",
			sortable: false,
            align: 'left',
            value: 'precio_maximo'
          },
          {
            text: "Proveedor",
            align: 'left',
			sortable: false,
            value: 'rep.nombre'
          },
          {
            text: "Acciones",
			sortable: false,
            align: 'left',
            value: 'actions'
          }
        ],
        headersEntidad: [{
            text: "id",
            align: 'left',
			sortable: false,
            value: 'id'
          },
          {
            text: "Subtotal",
            align: 'left',
			sortable: false,
            value: 'subtotal'
          },
          {
            text: "IVA",
			sortable: false,
            align: 'left',
            value: 'iva'
          },
          {
            text: "Total",
			sortable: false,
            align: 'left',
            value: 'total'
          },
          {
            text: "Precio maximo",
			sortable: false,
            align: 'left',
            value: 'precio_maximo'
          },
          {
            text: "Entidad",
			sortable: false,
            align: 'left',
            value: 'nombre'
          },
          {
            text: "Acciones",
			sortable: false,
            align: 'left',
            value: 'actions'
          }
        ],
        formularioEntidad: {
          entidad_id: ''
        },
        modalPrecioEditarEntidad: false,

        formularioPrecioEditarEntidad: {},
      }
    },
    mounted() {
      this.listarProductos();
    },
    watch: {
      paginaActual(newPage) {
        this.listarProductos(newPage);
      },
      prestador(val) {
        if (val) {
          if (val.length === 6) {
            this.listarPrestadores();
          } else if (val.length < 6) {
            this.listaPrestadores = null;
          }
        } else {
          this.listaPrestadores = null;
        }
      },
      "formularioPrecio.precio_unidad"() {
        this.calcularTotalPrecio();
      },
      "formularioPrecio.iva"() {
        this.calcularTotalPrecio();
      },
      "formularioEntidad.subtotal"() {
        this.calcularTotalPrecioTarifa()
      },
      "formularioEntidad.iva"() {
        this.calcularTotalPrecioTarifa()
      },
      "formularioPrecioEditar.precio_unidad"() {
        this.calcularTotalPrecioEditar();
      },
      "formularioPrecioEditar.iva"() {
        this.calcularTotalPrecioEditar();
      },
      "formularioPrecioEditarEntidad.subtotal"() {
        this.calcularTotalPrecioTarifaEditar();
      },
      "formularioPrecioEditarEntidad.iva"() {
        this.calcularTotalPrecioTarifaEditar();
      }
    },
    methods: {


      listarProductos() {
        this.preload = true;
        this.loading = true;
        this.$axios.post("/codesumis/listarCodigosSumi?page=" + this.pagina + "&cant=" + this.opcionActual,
          this.filtro).then(res => {
            this.productos = [];
            this.$nextTick(() => {
            this.productos = res.data.data;
            this.total = res.data.last_page;
            }) ;
        }).catch(() => {
          this.$toast.error('Error al listar los productos');
        }).finally(() => {
          this.preload = false;
          this.loading = false;
        });
      },


      limpiarFiltro() {
        this.filtro.codigo = null,
          this.filtro.producto = null,
          this.listarProductos();
      },
      openModalProducto() {
        this.productoActual = {};
        this.condicionCampos = false;
        this.$refs.dialogModalProducto.limpiarValidacion();
        this.dialogProducto = true;
      },
      editProducto(producto) {
        this.condicionCampos = true;
        // console.log('fd', producto);
        this.productoActual = {
          ...producto,
        };

        this.productoActual.requiere_autorizacion = producto.requiere_autorizacion == true ? '1' : '0';
        this.productoActual.nivel_ordenamiento = producto.nivel_ordenamiento?.toString()
        this.productoActual.nivel_portabilidad = producto.nivel_portabilidad?.toString()
        this.productoActual.programa_farmacia_id = producto.programas_farmacia
        this.dialogProducto = true;
        this.$nextTick(() => {
          this.$refs.dialogModalProducto.listarPrincipiosActivos();
          this.$refs.dialogModalProducto.listarParametrizacionesCodesumi()
      });
      },
      guardarProducto(producto) {
        // Si los valores a los que se les aplica la funcion extractId no cambian los envía como objeto por eso se toma el ID
        const extractId = (obj) => obj && typeof obj === 'object' ? obj.id : obj;
        const mappedProducto = {
          codigo: producto.codigo,
          nombre: producto.nombre,
          requiere_autorizacion: producto.requiere_autorizacion,
          nivel_ordenamiento: producto.nivel_ordenamiento,
          nivel_portabilidad: producto.nivel_portabilidad,
          tipo_codesumi: producto.tipo_codesumi,
          via: producto.via,
          frecuencia: producto.frecuencia,
          cantidad_maxima_orden: producto.cantidad_maxima_orden,
          cantiad_maxima_orden_dia: producto.cantiad_maxima_orden_dia,
          ambito: producto.ambito,
        //   unidad_medida: producto.unidad_medida,
          unidad_concentracion: producto.unidad_concentracion,
          grupo_terapeutico_id: extractId(producto.grupo_terapeutico_id),
          subgrupos_terapeuticos: extractId(producto.subgrupos_terapeuticos),
          forma_farmaceutica_id: extractId(producto.forma_farmaceutica_id),
          linea_base_id: extractId(producto.linea_base_id),
          grupo_id: extractId(producto.grupo_id),
          concentracion_1: producto.concentracion_1,
          concentracion_2: producto.concentracion_2,
          concentracion_3: producto.concentracion_3,
          abc: producto.abc,
          estado_normativo: producto.estado_normativo,
          control_especial: producto.control_especial,
          critico: producto.critico,
          regulado: producto.regulado,
          activo_horus: producto.activo_horus,
          alto_costo: producto.alto_costo,
          estado_id: 1,
          programa_farmacia_id: producto.programa_farmacia_id,
          principio_activo: producto.principio_activo,
          unidad_medida_id: producto.unidad_medida_id,
          unidad_medida_dispensacion_id: producto.unidad_medida_dispensacion_id,
          ffm_id: producto.ffm_id,
          observacion: producto.observacion,
          medicamento_vital: producto.medicamento_vital
        };
        this.preload = true;
        if (producto.id) {
          // Editar producto existente
          this.$axios.put(`/codesumis/actualizar/${producto.id}`, mappedProducto).then(res => {
            this.$toast.success('Producto editado correctamente');
            this.dialogProducto = false;
            this.listarProductos();
          }).catch(() => {
            this.$toast.error('Error al editar el producto');
          }).finally(() => {
            this.preload = false;
          });
        } else {
          // Crear nuevo producto
          this.$axios.post('/codesumis/crear', mappedProducto).then(res => {
            this.$toast.success('Producto creado correctamente');
            this.dialogProducto = false;
            this.listarProductos();
          }).catch(() => {
            this.$toast.error('Error al crear el producto');
          }).finally(() => {
            this.preload = false;
          });
        }
      },
      openModalCrearMedicamento(item) {
        console.log('item', item);
        this.medicamentoActual = {
          codesumi_id: item.id,
          nivel_ordenamiento: item.nivel_ordenamiento,
          codigo: item.codigo
        };
        this.dialogMedicamento = true;
      },
      editMedicamento(medicamento) {
        console.log('med', medicamento);
        this.medicamentoActual = {
          cum:medicamento.cum,
          id: medicamento.id,
          abc: medicamento.abc,
          clasificacion_riesgo: medicamento.clasificacion_riesgo,
          codesumi_id: medicamento.codesumi_id,
          cum_validacion: medicamento.invima ? medicamento.invima.cum_validacion : null,
          descripcion_comercial: medicamento.invima ? medicamento.invima.descripcion_comercial : null,
          estado_registro: medicamento.invima ? medicamento.invima.estado_registro : null,
          fecha_vencimiento: medicamento.invima ? medicamento.invima.fecha_vencimiento : null,
          ium_primernivel: medicamento.ium_primernivel,
          ium_segundonivel: medicamento.ium_segundonivel,
          marca_dispositivo: medicamento.marca_dispositivo,
          muestra_medica: medicamento.invima ? medicamento.invima.muestra_medica : null,
          origen: medicamento.origen,
          pos: medicamento.pos,
          principio_activo: medicamento.invima ? medicamento.invima.principio_activo : null,
          registro_sanitario: medicamento.invima ? medicamento.invima.registro_sanitario : null,
          titular: medicamento.invima ? medicamento.invima.titular : null,
          precio_maximo: medicamento.precio_maximo,
          producto: medicamento.invima ? medicamento.invima.producto : null,
          expediente: medicamento.invima ? medicamento.invima.expediente : null,
          resolucion: medicamento.resolucion,
          activo_horus: medicamento.activo_horus,
          refrigerado: medicamento.refrigerado,
          generico: medicamento.generico,
          comercial: medicamento.comercial,
          // regulado: medicamento.regulado,
          nivel_ordenamiento: medicamento.nivel_ordenamiento,
          codigo: medicamento.codigo_medicamento,
          medicamento_vital: medicamento.medicamento_vital,
          costo_promedio:medicamento.costo_promedio
        };
        this.dialogMedicamento = true;
      },

      guardarMedicamento(medicamento) {
        console.log('f', medicamento);
        if (medicamento.id) {
          this.preload = true;
          this.$axios.put('/medicamentos/actualizar/'+medicamento.id, medicamento).then(res => {
            this.$toast.success('Medicamento creado correctamente');
          }).catch(error => {
            this.$toast.error('Error al crear el medicamento');
            console.log(error);
          }).finally(() => {
            this.listarProductos();
            this.preload = false;
          })
          console.log(`Crear Medicamento`, medicamento)
        } else {
          this.preload = true;
          this.$axios.post('/medicamentos/crear', medicamento).then(res => {
            this.$toast.success('Medicamento creado correctamente');
          }).catch(error => {
            this.$toast.error('Error al crear el medicamento');
            console.log(error);
          }).finally(() => {
            this.listarProductos();
            this.preload = false;
          })
          console.log(`Crear Medicamento`, medicamento)
        }

      },
      editarPrecio(item) {
        console.log('dddst', item);
        this.precio_maximo = item.precio_maximo
        if (item.invima) {
          this.obtenerPrecioMedicamento(item.id)
          this.modalPrecio = true
          this.formularioPrecio.medicamento_id = item.id
          this.formularioPrecio.precio_maximo =item.precio_maximo
        }
        this.formularioEntidad.medicamento_id = item.id
        this.obtenerPrecioEntidad(item.id)
        this.listarEntidades()
      },



      cambiarEstadoProducto(producto) {
        console.log('dd', producto);
        this.$swal({
          title: `¿Está segur@ de que desea ${producto.estado_id === 1 ? 'inactivar' : 'activar'} el producto?`,
          text: `Se ${producto.estado_id === 1 ? 'inactivará' : 'activará'} el producto ${producto.nombre} `,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
        }).then(res => {
          if (res.value) {
            if (producto.estado_id === 1) {
              producto['estado_id'] = 2
            } else {
              producto['estado_id'] = 1
            }
            this.preload = true;
            this.$axios.post(`/codesumis/cambiarEstadoProducto`, {
              codesumi: producto.id,
              estado: producto.estado_id
            }).then(() => {
              this.$toast.success(`Se cambió el estado del producto correctamente`);
            }).catch(error => {
              this.$toast.error('Error al cambiar el estado del producto');
              console.log(error)
            }).finally(() => {
              this.preload = false
              this.listarProductos()
            })
          }
        })
      },

      cambiarEstadoMedicamento(medicamento) {
        console.log('d', medicamento);
        this.$swal({
          title: `¿Está segur@ de que desea ${medicamento.estado_id == 1 ? 'inactivar' : 'activar'} el medicamento?`,
          text: `Se ${medicamento.estado_id == 1 ? 'inactivará' : 'activará'} el medicamento ${medicamento.invima.producto} `,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
        }).then(res => {
          if (res.value) {
            if (medicamento.estado_id === 1) {
              medicamento['estado_id'] = 2
            } else {
              medicamento['estado_id'] = 1
            }
            this.preload = true;
            this.$axios.post(`/medicamentos/cambiarEstadoMedicamento`, {
              medicamento: medicamento.id,
              estado_id: medicamento.estado_id
            }).then(() => {
              this.$toast.success('Se cambió el estado del medicamento correctamente');
            }).catch(error => {
              this.$toast.error('Error al cambiar el estado del medicamento');
              console.log(error)
            }).finally(() => {
              this.preload = false
              this.listarProductos()
            })
          }
        })
      },

      obtenerPrecioMedicamento(id) {
        this.preload = true
        this.$axios.post('/precios/precioMedicamento', {
            medicamento: id
          })
          .then(res => {
            console.log('res', res.data);
            this.listaPrecioMedicamneto = res.data
            this.preload = false
          })
          .catch(error => {
            this.preload = false
            // this.$toast.error(error.response.data.message);
          });
      },

      listarPrestadores() {
        this.preload = true;
        this.$axios.post('reps/listar?page=0', {
          prestador: this.prestador
        }).then(res => {
          this.preload = false;
          // this.listaPrestadores = res.data.map((rep) => {
          //   return {
          //     id: rep.id,
          //     nombre: `${rep.prestadores.nit}-${rep.nombre} - ${rep.municipio.nombre}`,
          //   }
          // })
          this.listaPrestadores = res.data.filter((cod) => {
            if (cod.proovedor == true) {
              return cod
            }
          })
        }).catch(e => {
          this.preload = false;
          console.log(e);
        })
      },

      agregarPrecio() {
        this.$axios.post('/precios/crear', this.formularioPrecio)
          .then(response => {
            this.$toast.success('medicamento creado con exito');
            this.obtenerPrecioMedicamento(this.formularioPrecio.medicamento_id)
            for (const key in this.formularioPrecio) {
              this.formularioPrecio[key] = ''
            }
            this.formularioPrecio.precio_maximo = this.precio_maximo
            // this.modalPrecio = false
            // this.limpiarmedicamento()
            // this.editable = false
          })
          .catch(error => {
            // this.$toast.error(error.response.data.message);
          });
      },

      calcularTotalPrecio() {
        if (this.formularioPrecio.precio_unidad && this.formularioPrecio.iva) {
          if(this.formularioPrecio.iva == '0'){
            this.formularioPrecio.total =parseInt(this.formularioPrecio.precio_unidad)
          }else{
          const total = (this.formularioPrecio.precio_unidad * this.formularioPrecio.iva) / 100
          this.formularioPrecio.total = parseInt(this.formularioPrecio.precio_unidad) + parseInt(total)
        }
          }


      },

      calcularTotalPrecioTarifa() {
        if (this.formularioEntidad.subtotal && this.formularioEntidad.iva) {
          if(this.formularioEntidad.iva == '0'){
            this.formularioEntidad.total = parseInt(this.formularioEntidad.subtotal)
          }else{
            const total = (this.formularioEntidad.subtotal * this.formularioEntidad.iva) / 100
            this.formularioEntidad.total = parseInt(this.formularioEntidad.subtotal) + parseInt(total)
          }

        }

      },

      calcularTotalPrecioEditar() {
        if (this.formularioPrecioEditar.precio_unidad && this.formularioPrecioEditar.iva) {
          const total = (this.formularioPrecioEditar.precio_unidad * this.formularioPrecioEditar.iva) / 100
          this.formularioPrecioEditar.total = parseInt(this.formularioPrecioEditar.precio_unidad) + parseInt(total)
        }
      },

      calcularTotalPrecioTarifaEditar() {
        if (this.formularioPrecioEditarEntidad.subtotal && this.formularioPrecioEditarEntidad.iva) {
          const total = (this.formularioPrecioEditarEntidad.subtotal * this.formularioPrecioEditarEntidad.iva) / 100
          this.formularioPrecioEditarEntidad.total = parseInt(this.formularioPrecioEditarEntidad.subtotal) + parseInt(
            total)
        }

      },

      editarPrecioMedicamento(item) {
        this.formularioPrecioEditar = item
        this.prestador = item.rep.nombre.slice(0, 5)
        this.listarPrestadores()
        this.formularioPrecioEditar.iva = item.iva
        this.formularioPrecioEditar.precio_unidad = parseFloat(item.precio_unidad)
        this.formularioPrecioEditar.total = parseFloat(item.total)
        this.formularioPrecioEditar.precio_maximo = parseFloat(item.precio_maximo)
        this.formularioPrecioEditar.rep_id = item.rep.id
        this.modalPrecioEditar = true
      },

      actualizarPrecio() {
        this.$axios.put('/precios/actualizar/' + this.formularioPrecioEditar.id, this.formularioPrecioEditar).then(
          res => {
            this.$toast.success('Se ha creado el responsable exitosamente!.')
            this.modalPrecioEditar = false
            this.obtenerPrecioMedicamento(this.formularioPrecioEditar.medicamento_id)
            this.prestador = ''
          }).catch(error => {
          this.preload = false
        })
      },

      listarEntidades() {
        this.preload = true;
        this.$axios.get('/entidad/listar').then(
          res => {
            this.entidades = res.data;
            this.preload = false;
          }).catch(e => {
          this.preload = false;
        })
      },

      obtenerPrecioEntidad(id) {
        this.$axios.post('/precio-entidad-medicamento/listar', {
            medicamento_id: id
          })
          .then(res => {
            console.log('res', res.data);
            this.listaPrecioEntidad = res.data
          })
          .catch(error => {
            // this.$toast.error(error.response.data.message);
          });
      },

      agregarTarifa() {
        this.$axios.post('/precio-entidad-medicamento/crear', this.formularioEntidad)
          .then(response => {
            this.$toast.success('medicamento creado con exito');
            this.obtenerPrecioEntidad(this.formularioEntidad.medicamento_id)
            for (const key in this.formularioEntidad) {
              this.formularioEntidad[key] = ''
            }
          })
          .catch(error => {});
      },

      editarPrecioEntidad(item) {
        this.formularioPrecioEditarEntidad = item
        this.formularioPrecioEditarEntidad.entidad_id = parseInt(item.entidad_id)
        this.formularioPrecioEditarEntidad.iva = item.iva
        this.formularioPrecioEditarEntidad.subtotal = parseFloat(item.subtotal)
        this.formularioPrecioEditarEntidad.total = parseFloat(item.total)
        this.formularioPrecioEditarEntidad.precio_maximo = parseFloat(item.precio_maximo)
        this.modalPrecioEditarEntidad = true
      },

      actualizarPrecioEntidad() {
        this.preload = true
        this.$axios.put('/precio-entidad-medicamento/actualizar/' + this.formularioPrecioEditarEntidad.id, this
          .formularioPrecioEditarEntidad).then(
          res => {
            this.$toast.success('Se ha actualizado exitosamente!.')
            this.modalPrecioEditarEntidad = false
            this.obtenerPrecioEntidad(this.formularioPrecioEditarEntidad.medicamento_id)
            this.preload = false
            // this.prestador = ''
          }).catch(error => {
          this.preload = false
        })
      },

    }
  }

</script>
