<template>

	<v-card class="rounded-xl">
		<v-card-title>
			<v-toolbar flat>
				<v-toolbar-title>
					<div class="d-flex align-center">
						<img src="/images/ojo.svg" alt="" height="50px" width="50px">
						<span>Especialidades</span>
					</div>
				</v-toolbar-title>
				<v-divider class="mx-4" inset vertical></v-divider>
				<v-spacer></v-spacer>
			</v-toolbar>
		</v-card-title>
		<v-card-text>
			<v-data-table dense :headers="headersEspecialidades" :search="search" :items="especialidades"
				no-data-text="Sin datos para mostrar">
				<template v-slot:top>
					<v-toolbar flat>
						<v-row>
							<v-col md="5" lg="5" xl="5" sm="6" cols>
								<v-text-field dense v-model="search" label="Buscar ...">
								</v-text-field>
							</v-col>
						</v-row>
					</v-toolbar>
				</template>
				<template v-slot:[`item.actions`]="{ item }">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
								@click="agregarCup(item)">
								mdi-pencil
							</v-icon>
						</template>
						<span>Agregar cup</span>
					</v-tooltip>
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-icon :color="item.requiere_telesalud == true ? 'success' : 'error'" v-bind="attrs"
								v-on="on" @click="cambiarMarca(item)">{{
                 					 item.requiere_telesalud == true ? "mdi-toggle-switch-off": "mdi-toggle-switch"
                				}}
							</v-icon>
						</template>
						<span>Marcar especialidad</span>
					</v-tooltip>
				</template>

			</v-data-table>
		</v-card-text>
		<v-dialog v-model="dialogoCup" persistent width="600">
			<v-card>
				<v-alert icon="mdi-stethoscope" text dense :color="'info'">
					<b>{{'Agregar Cup'}}</b>
				</v-alert>
				<v-card-text>
					<v-row>
						<v-col cols="12" sm="12" md="12">
							<v-autocomplete dense v-model="busquedaServicio" :items="cup" item-text="cups"
								item-value="id" label="CUP - Servicio" :search-input.sync="FiltroCups"
								no-data-text="Por favor escriba el nombre del servicio" />
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red" small @click="dialogoCup=false,busquedaServicio='',cup=null" dark>Cerrar</v-btn>
					<v-btn small :color="'success'" @click="guardarCup()">
						{{'Guardar'}}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-card>


</template>

<script>
	import {
		mapActions
	} from "vuex"
	export default {
		middleware({
			$can,
			redirect
		}) {
			if (!$can('blog.vista')) {
				return redirect('/');
			}
		},
		name: "WorkspaceJsonEspecialidadesCoponent",

		data() {
			return {
				search: null,
				dialog: false,
				loading: {
					form: false
				},
				especialidades: [],
				headersEspecialidades: [{
						text: 'id',
						value: 'id',
					},
					{
						text: 'Nombre',
						align: 'start',
						sortable: false,
						value: 'nombre',
					},
					{
						text: 'Acciones',
						value: 'actions',
						sortable: false,
					},
				],
				FiltroCups: '',
				cup: [],
				dialogoCup: false,
				busquedaServicio: '',
				datosCup:{}
			};
		},

		created() {
			this.listarEspecialidad()
		},

		watch: {
			FiltroCups(val) {
				if (val) {
					if (val.length === 4) {
						this.listaCups();
					} else if (val.length < 4) {
						this.cups = null;
					}
				} else {
					this.cups = null;

				}
			},
		},

		methods: {
			...mapActions('app', ['setPreload']),
			async listarEspecialidad() {
				try {
					this.setPreload(true)
					const response = await this.$axios.post('/especialidades/listarTodas')
					this.especialidades = response.data;
				} catch (error) {
					console.error(error)
				} finally {
					this.setPreload(false)
				}
			},

			clearEspecialidad() {
				for (const key in this.editedItem) {
					this.editedItem[key] = ''
				}
			},

			getColor(estado) {
				if (estado == 1) return 'success'
				else return 'error'
			},

			cambiarMarca(item) {
				// this.setPreload(true)
				this.$swal({
					title: "Está seguro?",
					text: "Desea cambiar la marcación",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#28a745",
					cancelButtonColor: "#d33",
					confirmButtonText: "Aceptar",
					cancelButtonText: "Cancelar",

				}).then((result) => {
					if (result.value) {
						this.$axios
							.put(`/especialidades/cambiarMarca/${item.id}`, {
								'requiere_telesalud': item.requiere_telesalud == true ? false : true,
							})
							.then(() => {
								this.$toast.success("Cambio de estado exitoso");
								this.listarEspecialidad()
							})
							.catch((error) => {
								this.$toast.error("Ocurrió un error al cambiar el estado");
								console.log(error);
							})
							.finally(() => {
								// this.setPreload(false)
							});
					}
				});
			},

			listaCups() {
				this.setPreload(true)
				this.$axios.get('/cup/BuscarCup/' + this.FiltroCups, {

				}).then(res => {
					this.cup = res.data.original
				}).catch(e => {
					e.response
				}).finally(e =>{
					this.setPreload(false);
				})
			},

			agregarCup(item) {
				if(item.cups){
					this.busquedaServicio = item.cups
					this.FiltroCups = item.cups.nombre.slice(0, 4)
				}
				this.datosCup = item
				this.dialogoCup = true
			},

			guardarCup(){
				this.setPreload(true);
				this.$axios.post('/especialidades/guardarCup',{'cup_id':this.busquedaServicio,'especialidad':this.datosCup.id}).then(res => {
					this.dialogoCup =false
					this.datosCup = {}
					this.busquedaServicio =''
					this.cups = null;
				}).catch(e => {
					e.response
				}).finally(e =>{
					this.setPreload(false);

				})
			}

		},

	}

</script>
