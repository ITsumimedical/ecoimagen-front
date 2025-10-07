<template>
	<div>
		<v-card flat>
			<v-alert type="info" icon="mdi-pill-multiple" text prominent dense>
				<b> Programas Farmacia </b>
			</v-alert>
			<v-card-title>
				<v-btn @click="dialogoCrear = true" tile color="success" small>
					<v-icon left> mdi-plus-circle</v-icon>
					Nuevo programa
				</v-btn>
			</v-card-title>
			<v-spacer></v-spacer>
			<v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
			              hide-details></v-text-field>
			<v-data-table :search="search" :items="programas" :headers="headers" class="elevation-1 mt-4"
			              hide-default-footer
			              disable-pagination no-data-text="Sin datos para mostrar" dense>
				<template v-slot:item.activo="{ item }">
					<span>{{ item.activo == 1 ? 'Activo' : 'Inactivo' }}</span>
				</template>
				<template v-slot:[`item.actions`]="{ item }">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on" @click="editarPrograma(item)">
								mdi-pencil
							</v-icon>
						</template>
						<span>Editar</span>
					</v-tooltip>
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-icon color="info" class="mr-2" v-bind="attrs" v-on="on"
							        @click="AgregarBodegasPrograma(item)">
								mdi-store-marker
							</v-icon>
						</template>
						<span>Agregar Bodegas</span>
					</v-tooltip>
					<v-tooltip top v-if="parseInt(item.id) != 1">
						<template v-slot:activator="{ on, attrs }">
							<v-icon color="grey" class="mr-2" v-bind="attrs" v-on="on"
							        @click="abrirModalAgregarDiagnosticos(item)">
								mdi-list-box-outline
							</v-icon>
						</template>
						<span>Agregar Diagnósiticos</span>
					</v-tooltip>
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-icon :color="item.activo == 1 ? 'green' : 'red'" class="mr-2" v-bind="attrs" v-on="on"
							        @click="cambiarEstadoPrograma(item)">
								{{ item.activo == 1 ? 'mdi-toggle-switch-off' : 'mdi-toggle-switch' }}
							</v-icon>
						</template>
						<span>{{ item.activo == 1 ? 'Desactivar' : 'Activar' }}</span>
					</v-tooltip>
				</template>
			</v-data-table>
			<v-row no-gutters style="background-color: white;">
				<v-col md="8" lg="9" xl="10" sm="10" class="px-2">
					<v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
					              @input="listarProgramas">
					</v-pagination>
				</v-col>
				<v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
					<v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
					          @change="listarProgramas">
					</v-select>
				</v-col>
			</v-row>
		</v-card>

		<v-dialog v-model="dialogoCrear" persistent max-width="600px">
			<v-card>
				<v-alert type="info" icon="mdi-pill-multiple" text prominent dense>
					<b> Crear nuevo programa de farmacia</b>
				</v-alert>
				<v-col cols="12" md="12">
					<v-text-field outlined dense label="Nombre" v-model="programa.nombre">
					</v-text-field>
				</v-col>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red" dark small @click="cerrarDialogoCrear()">Cancelar</v-btn>
					<v-btn color="success" small @click="crearPrograma()">Crear</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="Editar" persistent max-width="600px">
			<v-card>
				<v-alert type="info" icon="mdi-pill-multiple" text prominent dense>
					<b> Editar programa de farmacia</b>
				</v-alert>
				<v-col cols="12" md="12">
					<v-text-field outlined dense label="Nombre" v-model="edicion.nombre">
					</v-text-field>
				</v-col>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red" dark small @click="Editar = false">Cancelar</v-btn>
					<v-btn color="warning" small @click="actualizarPrograma">Editar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="AgregarBodegas" max-width="800px">
			<v-card>
				<v-alert type="info" icon="mdi-store-marker" text prominent dense>
					Agregar bodegas al programa <b>{{ programa_nombre }}</b>
				</v-alert>
				<v-container>
					<v-row>
						<v-col cols="12" md="9">
							<v-autocomplete outlined dense label="Bodegas" :items="bodegas" item-text="nombre"
							                item-value="id"
							                v-model="bodega_id" deletable-chips multiple chips>
							</v-autocomplete>
						</v-col>
						<v-col cols="1" sm="1" md="1">
							<v-tooltip top>
								<template v-slot:activator="{ on, attrs }">
									<v-btn class="mx-2" small fab dark color="info" v-bind="attrs" v-on="on"
									       @click="crearBodega()">
										<v-icon dark>
											mdi-plus
										</v-icon>
									</v-btn>
								</template>
								<span>Asignar bodegas al programa</span>
							</v-tooltip>
						</v-col>
						<v-col md="12">
							<v-alert type="info" icon="mdi-handshake" text dense>
								Bodegas asignadas al programa
							</v-alert>

							<v-data-table v-model="bodegaAsignada" :loading="loading" :items="bodegasPrograma"
							              :headers="bodegaHeaders" show-select class="elevation-1 mt-4"
							              no-data-text="Sin datos para mostrar"
							              dense>
								<template v-slot:item.nombre="{ item }">
									<span>{{ item.nombre }}</span>
								</template>

							</v-data-table>

							<!-- <pre>{{ bodegasPrograma }}</pre> -->
						</v-col>
					</v-row>
				</v-container>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red" dark small @click="cerrarDialogoBodegas()">Cancelar</v-btn>
					<v-btn color="warning" dark small @click="remover()">remover</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="preload" persistent width="300">
			<v-card color="primary" dark>
				<v-card-text>
					Tranquilo procesamos tu solicitud !
					<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-dialog>

		<!-- Parametrizar Diagnósticos -->
		<modal-agregar-diagnostico-programa :mostrar-modal-agregar-diagnosticos.sync="mostrarModalAgregarDiagnosticos"
		                                    :programa-seleccionado="programaSeleccionado"/>

	</div>
</template>

<script>
import ModalAgregarDiagnosticoPrograma from "~/components/programasFarmacia/modalAgregarDiagnosticoPrograma.vue";

export default {
	components: {ModalAgregarDiagnosticoPrograma},
	data() {
		return {
			programas: [],
			pagina: 1,
			total: 0,
			opcionActual: 5,
			opciones: [5, 10, 20, 50, 100],
			dialogoCrear: false,
			preload: false,
			AgregarBodegas: false,
			bodegasPrograma: [],
			bodega_id: '',
			bodegas: [],
			search: '',
			Editar: '',
			programa_nombre: '',
			bodegaAsignada: [],
			loading: false,
			edicion: {
				nombre: ''
			},
			programa: {
				nombre: '',
				activo: 1
			},
			headers: [{
				text: "Id",
				value: "id",
				align: "start",
			},
				{
					text: "Nombre",
					value: "nombre",
					align: "start",
				},
				{
					text: "Activo",
					value: "activo",
					align: "start",
				},
				{
					text: "Acciones",
					value: "actions",
					align: "center",
				},
			],
			bodegaHeaders: [{
				text: "ID",
				value: "id"
			},
				{
					text: "Nombre",
					value: "nombre"
				},
			],
			programaSeleccionado: {},
			mostrarModalAgregarDiagnosticos: false
		};
	},

	mounted() {
		this.listarProgramas();
	},
	methods: {
		listarProgramas() {
			this.preload = true;
			this.$axios
				.get(`programa-farmacia/listar?page=${this.pagina}&filas=${this.opcionActual}`)
				.then(res => {
					this.programas = res.data.data;
					this.total = res.data.last_page;
					this.preload = false;
				})
				.catch((error) => {
					this.preload = false;
					console.log(error);
				});
		},
		crearPrograma() {
			this.preload = true;
			this.$axios
				.post("programa-farmacia/crear", this.programa)
				.then(() => {
					this.dialogoCrear = false;
					this.listarProgramas();
					this.programa.nombre = '';
					this.preload = false;
				})
				.catch((error) => {
					this.preload = false;
					console.log(error);
				});
		},

		actualizarPrograma() {
			this.preload = true;
			this.$axios
				.put(`programa-farmacia/actualizar/${this.programa.id}`, {
					nombre: this.edicion.nombre,
					activo: 1
				})
				.then(() => {
					this.Editar = false;
					this.listarProgramas();
					this.programa.nombre = '';
					this.preload = false;
				})
				.catch((error) => {
					this.preload = false;
					console.log(error);
				});
		},

		listarBodegas() {
			this.preload = true
			this.$axios.get('/bodegas/listar').then(res => {
				this.bodegas = res.data
				this.preload = false
			}).catch(e => {
				console.log(e.response)
				this.preload = false
			})
		},
		cambiarEstadoPrograma(item) {
			this.preload = true;
			this.$axios
				.put(`programa-farmacia/cambiarEstado/${item.id}`, {
					activo: item.activo ? 0 : 1
				})
				.then(() => {
					this.preload = false;
					this.listarProgramas();
				})
				.catch((error) => {
					this.preload = false;
					console.log(error);
				});
		},
		editarPrograma(item) {
			this.edicion.nombre = item.nombre;
			this.programa.id = item.id
			this.Editar = true;
		},

		cerrarDialogoCrear() {
			this.dialogoCrear = false,
				this.programa = {
					nombre: '',
				}
		},

		cerrarDialogoBodegas() {
			this.AgregarBodegas = false;
			this.bodega_id = ''
		},

		AgregarBodegasPrograma(item) {
			this.programa_farmacia_id = item.id;
			this.programa_nombre = item.nombre;
			this.AgregarBodegas = true;
			this.listarBodegas();
			this.listarBodegasPrograma(item)
		},

		crearBodega() {
			this.preload = true
			this.$axios.post('/programa-bodegas/crearPrograma', {
				programa_farmacia_id: this.programa_farmacia_id,
				bodega_id: this.bodega_id
			})
				.then(response => {
					this.$toast.success('agregado con éxito');
					this.cerrarDialogoBodegas()
					this.preload = false;
				})
				.catch(error => {
					this.preload = false;
					this.$toast.error('La bodega ya se encuentra asignada a este programa')
					this.bodega_id = ''
				});
		},

		remover() {
			this.preload = true;
			const bodegaIds = this.bodegaAsignada.map(item => item.id);
			this.$axios.delete('programa-bodegas/eliminar', {
				data: {
					programa_farmacia_id: this.programa_farmacia_id,
					bodega_id: bodegaIds
				}
			})
				.then(response => {
					this.preload = false;
					this.$toast.success('Bodega eliminida del programa con éxito');
					this.listarBodegasPrograma({id: this.programa_farmacia_id});
				})
				.catch(error => {
					this.preload = false;
					this.$toast.error('Error al eliminar la bodega del programa')
				});
		},

		listarBodegasPrograma(item) {
			this.loading = true;
			this.$axios.get(`/programa-bodegas/bodegas/${item.id}`)
				.then(res => {
					this.bodegasPrograma = res.data.bodegas;
					this.loading = false;
					this.AgregarBodegas = true;
				})
				.catch(error => {
					console.log(error);
					this.loading = false;
				});
		},

		abrirModalAgregarDiagnosticos(programa) {
			this.programaSeleccionado = programa;
			this.mostrarModalAgregarDiagnosticos = true;
		}
	},
};

</script>
