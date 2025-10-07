<template>
	<div>

		<!-- Preload -->
		<template>
			<div class="text-center">
				<v-dialog v-model="preload" persistent width="300">
					<v-card color="primary" dark>
						<v-card-text>
							Tranquilo procesamos tu solicitud !
							<v-progress-linear
								indeterminate
								color="white"
								class="mb-0"
							></v-progress-linear>
						</v-card-text>
					</v-card>
				</v-dialog>
			</div>
		</template>

		<!-- card de botones y filtros -->
		<v-card class="mx-100">
			<div>
				<v-toolbar flat>
					<v-spacer></v-spacer>
					<v-btn
						v-if="$can('cups.guardar')"
						color="success"
						class="white--text ma-2 px-6"
						small
						@click="dialogs.form = true"
					>Crear
						<v-icon>mdi-plus</v-icon>
					</v-btn
					>
					<v-divider v-if="$can('cups.actualizarMasivo')" class="mx-4" inset vertical></v-divider>

					<v-btn
						v-if="$can('cups.actualizarMasivo')"
						color="success"
						class="white--text ma-2 px-6"
						small
						@click="dialogs.actualizarCups = true"
					>Actualizar Cups
						<v-icon>mdi-upload</v-icon>
					</v-btn
					>
				</v-toolbar>

        <v-row class="mx-2">
          <v-col md="2" lg="2" xl="2" sm="6" cols>
            <v-text-field
              dense
              v-model="filtro.codigo"
              label="Código cups"
              outlined
            >
            </v-text-field>
          </v-col>

					<v-col md="3" lg="3" xl="3" sm="6" cols>
						<v-text-field dense v-model="filtro.nombre" label="Nombre" outlined>
						</v-text-field>
					</v-col>

					<v-col md="1" lg="1" xl="1" sm="6" cols>
						<v-text-field
							dense
							type="number"
							v-model="filtro.nivel"
							label="Nivel"
							outlined
						>
						</v-text-field>
					</v-col>

					<v-col md="3" lg="3" xl="3" sm="6" cols>
						<v-autocomplete
							:items="[
                { id: 1, nombre: 'ambulatorio' },
                { id: 2, nombre: 'hospilatario' },
                { id: 3, nombre: 'Mixto' },
              ]"
              item-text="nombre"
              item-value="id"
              dense
              v-model="filtro.ambito"
              label="Ámbito"
              outlined
            >
            </v-autocomplete>
          </v-col>

					<v-col md="2" lg="2" xl="2" sm="6" cols>
						<v-btn-toggle background-color="white" dark>
							<v-btn v-if="$can('cups.listar')" small color="success" @click="getCups()">Filtrar</v-btn>
							<v-btn v-if="$can('cups.listar')" small class="ml-2" color="error" @click="limpiar()"
							>Limpiar
							</v-btn
							>
						</v-btn-toggle>
					</v-col>
				</v-row>
			</div>

			<v-divider class="mt-2"></v-divider>

			<!-- tabla de cups -->
			<v-data-table
				:headers="headers"
				:items="cups"
				class="elevation-1 mt-4 text-center"
				loading-text="cargando..."
				hide-default-footer
				disable-pagination
				no-data-text="Sin datos para mostrar"
				dense
			>
				<template v-slot:[`item.quirurgico`]="{ item }">
					<v-chip small dark :color="item.quirurgico ? 'success' : 'error'">{{
							item.quirurgico ? "Si" : "No"
						}}
					</v-chip>
				</template>

				<template v-slot:[`item.diagnostico_requerido`]="{ item }">
					<v-chip
						dark
						small
						:color="item.diagnostico_requerido ? 'success' : 'error'"
					>{{ item.diagnostico_requerido ? "Si" : "No" }}
					</v-chip
					>
				</template>

				<template v-slot:[`item.requiere_auditoria`]="{ item }">
					<v-chip small dark :color="item.requiere_auditoria ? 'success' : 'error'">{{
							item.requiere_auditoria ? "Si" : "No"
						}}
					</v-chip>
				</template>

				<template v-slot:[`item.periodicidad`]="{ item }">
					{{ item.periodicidad }} Dias
				</template>

				<template v-slot:[`item.activo`]="{ item }">
					<v-chip small dark :color="item.activo ? 'success' : 'error'">{{
							item.activo ? "Activo" : "Inactivo"
						}}
					</v-chip>
				</template>

				<template v-slot:[`item.acciones`]="{ item }">
					<v-tooltip top v-if="$can('cups.guardar')">
						<template v-slot:activator="{ on, attrs }">
							<v-icon
								:color="item.activo ? 'error' : 'success'"
								small
								v-bind="attrs"
								v-on="on"
								@click="cambiarEstado(item.id)"
							>
								mdi-account-convert
							</v-icon>
						</template>
						<span>{{ item.activo ? "Inactivar" : "Activar" }}</span>
					</v-tooltip>

					<v-tooltip top v-if="$can('cups.guardar')">
						<template v-slot:activator="{ on, attrs }">
							<v-icon
								color="warning"
								small
								v-bind="attrs"
								v-on="on"
								@click="abrirModalEditarCup(item)"
							>
								mdi-grease-pencil
							</v-icon>
						</template>
						<span>Editar</span>
					</v-tooltip>


					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-icon
								color="success"
								small
								v-bind="attrs"
								v-on="on"
								@click="abrirModalAsignarEntidadCup(item)"
							>
								mdi-file-document-arrow-right-outline
							</v-icon>
						</template>
						<span>Asignar entidades al cup</span>
					</v-tooltip>


				</template>

			</v-data-table>

			<v-row no-gutters>
				<v-col md="9" lg="9" xl="11" sm="11" class="px-2">
					<v-pagination
						v-model="pagina"
						class="my-4"
						:length="total"
						:total-visible="9"
						@input="getCups()"
					></v-pagination>
				</v-col>
				<v-col
					md="3"
					lg="3"
					xl="1"
					sm="1"
					class="px-2"
					cols
					style="min-width: 100px"
				>
					<v-select
						class="my-4"
						v-model="opcionActual"
						:items="opciones"
						dense
						solo
						small
						@change="getCups()"
					></v-select>
				</v-col>
			</v-row>
		</v-card>

		<v-dialog persistent v-model="dialogs.form" :max-width="widthContrato">
			<FormCupComponentVue
				:cup_id="cup_id"
				:editar="editando"
				@cerrar="cerrarModalEditar()"
				@submit="getCups()"
			/>
		</v-dialog>

		<v-dialog persistent v-model="dialogs.entidadCup" max-width="900px">
			<AsignarEntidad ref="asignarEntidad" :cup_id="cup_id" @cerrarDialogo="cerrarDialogo"></AsignarEntidad>
		</v-dialog>

		<v-dialog v-model="dialogs.actualizarCups" persistent max-width="500">
			<v-card :loading="loading">
				<template slot="progress">
					<v-progress-linear
						color="primary"
						height="10"
						indeterminate
					></v-progress-linear>
				</template>

				<v-card-title class="titulo black--text"> Subir o actualizar cups</v-card-title>

				<v-card-text>
					<v-file-input
						v-model="file"
						@change="manejoError"
						show-size
						accept=".xlsx"
						label="Selecccione el archivo"
					>
						<template v-slot:selection="{ text }">
							<v-chip small label color="primary">
								{{ text }}
							</v-chip>
						</template>
					</v-file-input>
					<v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="error"
						dark
						:disabled="loading"
						@click="(dialogs.actualizarCups = false), (file = null)"
					>
						cerrar
					</v-btn>
					<v-btn
						color="primary"
						dark
						:disabled="loading"
						@click="cargarArchivo()"
					>
						Subir
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Modal Asignar Entidades -->
		<modal-asignar-entidad-cup :cup="cupSeleccionado"
		                           :mostrar-modal-entidad-cup.sync="mostrarModalEntidadCup"/>

		<!-- Modal Editar CUP -->
		<modal-editar-cup :cup-seleccionado="cupSeleccionado" :mostrar-modal-editar-cup.sync="mostrarModalEditarCup"/>

	</div>
</template>
<script>
import FormCupComponentVue from "./FormCupComponent.vue";
import AsignarEntidad from "/components/contrato/cups/cupEntidades.vue"
import ModalAsignarEntidadCup from "~/components/contrato/cups/modalAsignarEntidadCup.vue";
import ModalEditarCup from "~/components/contrato/cups/modalEditarCup.vue";

export default {
  middleware({ $can, redirect }) {
    if (!$can("blog.vista")) {
      return redirect("/");
    }
  },
  components: {
      FormCupComponentVue,
      AsignarEntidad,
      ModalEditarCup,
      ModalAsignarEntidadCup
  },
  data() {
    return {
        mostrarModalEntidadCup:false,
        mostrarModalEditarCup:false,
        cupSeleccionado:null,
      headers: [
        { text: "Código", value: "codigo",  sortable: false },
        { text: "Nombre", value: "nombre",  sortable: false },
        { text: "Archivo Rips", value: "archivo", align: 'center',  sortable: false},
        { text: "Quirúrgico", value: "quirurgico", align: 'center',  sortable: false},
        { text: "Diagnóstico requerido", value: "diagnostico_requerido", align: 'center',  sortable: false},
        { text: "Requiere auditoría", value: "requiere_auditoria", align: 'center',  sortable: false},
        { text: "Periodicidad", value: "periodicidad", align: 'center',  sortable: false},
        { text: "Nivel Ordenamiento", value: "nivel_ordenamiento", align: 'center',  sortable: false},
        { text: "Cantidad Max", value: "cantidad_max_ordenamiento", align: 'center' ,  sortable: false},
        { text: "Ámbito", value: "ambito.nombre" ,  sortable: false},
        { text: "Estado", value: "activo" ,  sortable: false},
        { text: "Acciones", value: "acciones", sortable: false },
      ],
      cups: [],
      preload: null,
      widthContrato: "890px",
      filtro: {
        codigo: null,
        nombre: null,
        nivel: null,
        ambito: null,
      },
      cup_id: null,
      editando: false,
      buscar: null,
      loading: false,
      errorMessage: null,
      file: null,
      dialogs: {
        form: false,
        actualizarCups: false,
        entidadCup: false,
      },
      opciones: [5, 10, 15, 20, 50, 100],
      opcionActual: 15,
      pagina: 1,
      total: 0,
    };
  },

	mounted() {
		this.getCups();
	},

	methods: {
		getCups() {
			this.preload = true;
			this.$axios
				.post(
					"/cup/listar?page=" + this.pagina + "&cant=" + this.opcionActual,
					this.filtro
				)
				.then((res) => {
					this.cups = res.data.data.data;
					this.total = res.data.data.last_page;
					this.preload = false;
				})
				.catch((error) => {
					this.preload = false;
					this.$toast.error("No se ha podido cargar los datos");
				});
		},

		asignarcupEntidad(id) {
			this.dialogs.entidadCup = true,
				this.cup_id = id;
			this.$nextTick(() => {
				this.$refs.asignarEntidad.listarEntidadesAsignadas();
			});
		},

		cerrarDialogo() {
			// Cerrar el diálogo
			this.dialogs.entidadCup = false;
		},

		cambiarEstado(id) {
			this.$swal({
				title: "Desea cambiarle el estado?",
				text: "Al aceptar este mensaje, se realizara el cambio del estado",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#28a745",
				cancelButtonColor: "#d33",
				confirmButtonText: "Aceptar",
			}).then((result) => {
				if (result.value) {
					this.preload = true;
					this.$axios
						.put("/cup/cambiar-estado/" + id)
						.then((res) => {
							this.$toast.success("Se cambio el estado del cup correctamente");
						})
						.catch((error) => {
							this.$toast.error("Error al cambiar el estado del cup");
						}).finally(() => {
						this.getCups();
						this.preload = false;
					})
				}
			});
		},

		ModalEditar(id) {
			this.dialogs.form = true;
			this.widthContrato = "1500px";
			this.editando = true;
			this.cup_id = id;
		},

		cerrarModalEditar() {
			this.dialogs.form = false;
			this.editando = false;
			this.cup_id = null;
			this.widthContrato = "890px";
		},

		manejoError() {
			this.errorMessage = "";
		},

		cargarArchivo() {
			if (!this.file) {
				this.$toast.error("El archivo de carga es requerido");
				return;
			}
			this.loading = true;
			const formData = new FormData();
			formData.append("file", this.file);
			this.$axios.post("/cup/subirArchivo", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}).then(res => {
				this.loading = false;
				this.dialogs.actualizarCups = false;
				this.file = null;
				this.getCups();
				this.$toast.success('Se cargaron exitosamente los Cups');
			})
				.catch((error) => {
					this.loading = false;
					this.errorMessage = error.response.data.mensaje;
					this.file = null;
				});
		},

		limpiar() {
			this.preload = true;
			for (const prop of Object.getOwnPropertyNames(this.filtro)) {
				this.filtro[prop] = null;
			}
			this.preload = false;
			this.getCups();
		},

		abrirModalAsignarEntidadCup(cup) {
			this.cupSeleccionado = cup;
			this.mostrarModalEntidadCup = true;
		},

		abrirModalEditarCup(cup) {
			this.cupSeleccionado = cup;
			this.mostrarModalEditarCup = true;
		}
	},
};
</script>
