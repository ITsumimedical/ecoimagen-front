<template>
	<v-card>
		<v-card-title>
			<v-toolbar flat>
				<v-toolbar-title>
					<div class="d-flex align-center">
						<img src="/images/ojo.svg" alt="" height="50px" width="50px">
						<span>Consentimientos Informados</span>
					</div>
				</v-toolbar-title>
				<v-divider class="mx-4" inset vertical></v-divider>
				<v-spacer></v-spacer>
			</v-toolbar>
		</v-card-title>

		<v-data-table dense :headers="headers" :search="buscarConsentimiento" :items="consentimientos" sort-by="id"
			class="elevation-1" :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar">

			<template v-slot:[`item.estado`]="{ item }">
				<v-chip small :color="chipsEstado(item.estado)" dark>{{ item.estado == true ? 'Activo' : 'Inactivo' }}
				</v-chip>
			</template>
			<template v-slot:[`item.laboratorio`]="{ item }">
				<v-chip small :color="chipsEstado(item.laboratorio)" dark>{{ item.laboratorio == true ? 'Si' : 'No' }}
				</v-chip>
			</template>
			<template v-slot:[`item.odontologia`]="{ item }">
				<v-chip small :color="chipsEstado(item.odontologia)" dark>{{ item.odontologia == true ? 'Si' : 'No' }}
				</v-chip>
			</template>

			<template v-slot:top>

				<v-card-title>
					<v-btn small color="boton" class="mb-2 white--text" @click="dialog = true, isEditing = false">
						Nuevo
						<v-icon>
							mdi-plus-circle-outline
						</v-icon>
					</v-btn>
					<v-spacer></v-spacer>
					<v-text-field v-model="buscarConsentimiento" label="Buscar" append-icon="mdi-magnify" hide-details
						single-line>
					</v-text-field>
				</v-card-title>

				<v-dialog persistent v-model="dialog" max-width="1000px">
					<v-container fluid class="pa-0">
						<v-card>
							<v-alert text dense border="left" type="info">{{ titulo }}</v-alert>
							<form @submit.prevent="guardarConsentimientoInformado">
								<v-card-text>
									<v-row>
										<v-col cols="12" sm="12" md="12">
											<v-text-field outlined dense cols="12" sm="12" md="6"
												v-model="consentimiento.nombre" label="Nombre"
												:error-messages="errors.nombre">
											</v-text-field>
										</v-col>
										<v-col cols="12" sm="12" md="2">
											<v-text-field outlined dense cols="12" sm="12" md="6"
												v-model="consentimiento.codigo" label="Código"
												:error-messages="errors.codigo" :readonly="isEditing">
											</v-text-field>
										</v-col>
										<v-col cols="12" sm="12" md="2">
											<v-text-field outlined dense cols="12" sm="12" md="6"
												v-model="consentimiento.version" label="Versión"
												:error-messages="errors.version">
											</v-text-field>
										</v-col>
										<v-col cols="12" sm="12" md="3">
											<v-text-field outlined dense cols="12" sm="12" md="6"
												v-model="consentimiento.fecha_aprobacion" label="Fecha aprobacion"
												:error-messages="errors.fecha_aprobacion" type="date">
											</v-text-field>
										</v-col>
										<v-col cols="12" sm="12" md="2">
											<v-checkbox dense cols="12" sm="12" md="6"
												v-model="consentimiento.laboratorio" label="Laboratorio"
												:error-messages="errors.laboratorio">
											</v-checkbox>
										</v-col>
										<v-col cols="12" sm="12" md="2">
											<v-checkbox dense cols="12" sm="12" md="6"
												v-model="consentimiento.odontologia" label="Odontologia"
												:error-messages="errors.odontologia">
											</v-checkbox>
										</v-col>
										<v-col cols="12" sm="12" md="12" v-if="!isEditing">
											<v-autocomplete outlined dense v-model="consentimiento.cupId" :items="cups"
												item-text="CodigoNombre" item-value="id" small-chips chips
												deletable-chips multiple label="Cup"
												:error-messages="errors.cup_id"></v-autocomplete>
										</v-col>

										<v-col cols="12" sm="12" md="12">
											<v-textarea outlined dense auto-grow v-model="consentimiento.descripcion"
												label="Descripción" :error-messages="errors.descripcion">
											</v-textarea>
										</v-col>
										<v-col cols="12" sm="12" md="12">
											<v-textarea outlined dense auto-grow v-model="consentimiento.beneficios"
												label="Beneficios" :error-messages="errors.beneficios">
											</v-textarea>
										</v-col>
										<v-col cols="12" sm="12" md="12">
											<v-textarea outlined dense auto-grow v-model="consentimiento.riesgos"
												label="Riesgos" :error-messages="errors.riesgos">
											</v-textarea>
										</v-col>
										<v-col cols="12" sm="12" md="12">
											<v-textarea outlined dense auto-grow v-model="consentimiento.alternativas"
												label="Alternativas disponibles al procedimiento"
												:error-messages="errors.alternativas">
											</v-textarea>
										</v-col>
										<v-col cols="12" sm="12" md="12">
											<v-textarea outlined auto-grow v-model="consentimiento.riesgo_no_aceptar"
												label="Riesgo de no aceptar el procedimiento"
												:error-messages="errors.riesgo_no_aceptar">
											</v-textarea>
										</v-col>
										<v-col cols="12" sm="12" md="12">
											<v-textarea outlined dense auto-grow v-model="consentimiento.informacion"
												label="¿Que hacer si necesita más información?"
												:error-messages="errors.informacion">
											</v-textarea>
										</v-col>
										<v-col cols="12" sm="12" md="12">
											<v-textarea outlined dense auto-grow
												v-model="consentimiento.recomendaciones" label="Recomendaciones"
												:error-messages="errors.recomendaciones">
											</v-textarea>
										</v-col>


										<v-col cols="12" v-if="isEditing">
											<v-alert text dense border="left" type="warning"
												icon="mdi-medical-bag"><b>Cups relacionados</b></v-alert>
										</v-col>
										<v-col cols="12" sm="8" md="8" v-if="isEditing">
											<v-autocomplete outlined dense :items="cups" v-model="consentimiento.cupId"
												item-text="CodigoNombre" item-value="id" small-chips chips
												deletable-chips multiple label="Cup"
												:error-messages="errors.cup_id"></v-autocomplete>
										</v-col>
										<v-col cols="12" sm="4" md="4" v-if="isEditing">
											<v-btn small color="boton" class="mb-2 white--text"
												@click="agregarCups()">
												Agregar Cups
												<v-icon>
													mdi-plus-circle-outline
												</v-icon>
											</v-btn>
										</v-col>
										<v-col cols="12" sm="12" md="12" v-if="isEditing">
											<v-data-table :items="cupsConsentimiento"
												:headers="[{ text: 'Codigo', value: 'cup.codigo' }, { text: 'Nombre', value: 'cup.nombre' }, { text: 'Acción', value: 'actions' }]"
												:loading="loading" loading-text="Cargando..."
												no-data-text="Sin datos para mostrar" hide-default-footer dense
												:items-per-page="opcionActual" class="elevation-1">

												<template v-slot:[`item.actions`]="{ item }">
													<v-tooltip top>
														<template v-slot:activator="{ on, attrs }">
															<v-icon color="error" small v-bind="attrs" v-on="on"
																@click="eliminarCup(item.cup)">
																mdi-delete
															</v-icon>
														</template>
														<span>Eliminar Cup</span>
													</v-tooltip>
												</template>

											</v-data-table>
											<v-row no-gutters style="background-color: white;">
												<v-col md="8" lg="9" xl="10" sm="10" class="px-2">
													<v-pagination v-model="pagina" class="my-4" :length="total"
														:total-visible="10"
														@input="consultarCups(consentimiento.codigo)">
													</v-pagination>
												</v-col>
												<v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols
													style="min-width: 100px">
													<v-select class="my-4" v-model="opcionActual" :items="opciones"
														dense solo small @change="consultarCups(consentimiento.codigo)">
													</v-select>
												</v-col>
											</v-row>
										</v-col>
									</v-row>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn small color="error" @click="close()">
										Cancelar
									</v-btn>
									<v-btn small color="boton" dark @click="guardarConsentimientoInformado()">
										Guardar
									</v-btn>
								</v-card-actions>
							</form>
						</v-card>
					</v-container>
				</v-dialog>
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<v-tooltip top>
					<template v-slot:activator="{ on, attrs }">
						<v-icon :color="chipsEstadoAccion(item.estado)" v-bind="attrs" v-on="on"
							@click="estadoFormularioConsentimiento(item.codigo)">
							{{ item.estado == true ? 'mdi-toggle-switch-off' : 'mdi-toggle-switch' }}
						</v-icon>
					</template>
					<span>{{ item.estado == true ? "Inactivar" : "Activar" }}</span>
				</v-tooltip>

				<v-tooltip top>
					<template v-slot:activator="{ on, attrs }">
						<v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
							@click="editar(item), isEditing = true">
							mdi-pencil
						</v-icon>
					</template>
					<span>Editar</span>
				</v-tooltip>

				<v-tooltip top>
					<template v-slot:activator="{ on, attrs }">
						<v-icon color="primary" v-bind="attrs" v-on="on" @click="imprimirConsentimiento(item)">
							mdi-file-download-outline
						</v-icon>
					</template>
					<span>Descargar Consentimiento Informado</span>
				</v-tooltip>
			</template>
		</v-data-table>
		<!-- <v-row no-gutters style="background-color: white;">
			<v-col md="8" lg="9" xl="10" sm="10" class="px-2">
				<v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
					@input="listarConsentimientosInformados()">
				</v-pagination>
			</v-col>
			<v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
				<v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
					@change="listarConsentimientosInformados()">
				</v-select>
			</v-col>
		</v-row> -->
	</v-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	middleware({
		$can,
		redirect
	}) {
		if (!$can('consentimientosInformados.menu')) {
			return redirect('/');
		}
	},
	name: 'WorkspaceJsonConsentimientosInformados',
	data() {
		return {
			loading: false,
			dialog: false,
			dialogoEditar: false,
			dialogDelete: false,
			buscarConsentimiento: '',
			consentimientos: [],
			consentimiento: {
				cupId: [],
				descripcion: '',
				nombre: '',
				beneficios: '',
				riesgos: '',
				alternativas: '',
				riesgo_no_aceptar: '',
				informacion: '',
				recomendaciones: '',
				fecha_aprobacion: '',
				version: '',
				codigo: '',
				odontologia:false,
				laboratorio: false
			},
			isEditing: false,
			editedIndex: -1,
			defecto: {
				cupId: [],
				descripcion: '',
				nombre: '',
				beneficios: '',
				riesgos: '',
				alternativas: '',
				riesgo_no_aceptar: '',
				informacion: '',
				recomendaciones: '',
				fecha_aprobacion: '',
				version: '',
				codigo: '',
				laboratorio: false,
				odontologia:false

			},
			errors: {
				cupId: '',
				descripcion: '',
				nombre: '',
				beneficios: '',
				riesgos: '',
				alternativas: '',
				riesgo_no_aceptar: '',
				informacion: '',
				recomendaciones: '',
				fecha_aprobacion: '',
				version: '',
				codigo: ''
			},
			headers: [{
				text: 'Codigo',
				align: 'center',
				sortable: false,
				value: 'codigo',
			},
			{
				text: 'Version',
				align: 'center',
				sortable: false,
				value: 'version'
			},
			{
				text: 'Fecha de aprobación',
				align: 'center',
				sortable: false,
				value: 'fecha_aprobacion'
			},
			{
				text: 'Titulo',
				align: 'center',
				sortable: false,
				value: 'nombre'
			},
			{
				text: 'Estado',
				align: 'center',
				sortable: false,
				value: 'estado'
			},
			{
				text: 'Laboratorio',
				align: 'center',
				sortable: false,
				value: 'laboratorio'
			},
			{
				text: 'Odontologia',
				align: 'center',
				sortable: false,
				value: 'odontologia'
			},
			{
				text: 'Acciones',
				align: 'center',
				sortable: false,
				value: 'actions',
			},
			],
			pagina: 1,
			total: 0,
			opcionActual: 10,
			opciones: [10,20, 50, 100],
			cups: [],
			cupsConsentimiento: [],
			infoCachada:{},
			totalCachado:{}
		};
	},

	mounted() {
		this.listarConsentimientosInformados();
		this.listaCodigosHorus();
	},

	computed: {
		titulo() {
			return this.isEditing === false ? 'Crear consentimiento informado' : 'Editar consentimiento informado'
		},
	},

	watch: {
		dialogoBloqueos(val) {
			val || this.cerrarDialogo()
		},
	},

	methods: {
		...mapActions('app', ['setPreload']),
		close() {
			this.dialog = false
			this.$nextTick(() => {
				this.consentimiento = Object.assign({}, this.defecto)
				this.isEditing = false
				this.pagina=1
				this.opcionActual=10
			})
			this.limpiarError()
		},



		listarConsentimientosInformados() {
			this.loading = true;
			this.$axios.post('consentimientos-informados/listar')
				.then(
					res => {
						this.consentimientos = res.data
						this.total = res.data.last_page
						this.loading = false;
					}).catch(e => {
						console.log(e);
						this.loading = false;
					})
		},

		listaCodigosHorus() {
			this.setPreload(true);
			this.$axios.$post("cup/listar", { todos: true })
				.then((res) => {
					this.cups = res.data.map(cup => ({
						...cup,
						CodigoNombre: `${cup.codigo} - ${cup.nombre}`,
					}));
					this.setPreload(false);
				})
				.catch((e) => {
					console.error(e);
					this.setPreload(false);
				});
		},
		consultarCups(codigo){

			this.loading = true
			this.$axios.$post('consentimientos-informados/consultar-cup-formato?page='+this.pagina+'&cant='+this.opcionActual, {codigo:codigo})
				.then(res => {
					this.cupsConsentimiento = res.data
					this.total = res.last_page
					this.$set(this.infoCachada,codigo,this.cupsConsentimiento)
					this.$set(this.totalCachado,codigo,this.total)
				}).catch(e => {
					console.log(e);
				}).finally(() => {
					this.loading = false
				})
		},

		agregarCups(){
			this.setPreload(true);
				this.$axios.$post('consentimientos-informados/crear', this.consentimiento)
					.then(res => {
						this.$toast.success('Se agregó con éxito el cup')
						this.consentimiento.cupId = []
						this.consultarCups(this.consentimiento.codigo)
						this.limpiarError()
					}).catch(error => {
						if (error.response.data.mensaje) {
							this.$toast.error(error.response.data.mensaje)
						} else if (error.response.data) {
							this.ErrorEntrada(error.response.data)
						}	
					}).finally(()=>{
						this.setPreload(false);
					})
		},

		eliminarCup(item){
			this.$swal({
				title: "¿Está seguro de eliminar el cup?",
				text: "Al aceptar este mensaje, se eliminará el cup del consentimiento informado.",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#28a745",
				cancelButtonColor: "#d33",
				confirmButtonText: "Aceptar",
				cancelButtonText: "Cancelar",
			}).then((result) => {
				if (result.value) {
					this.setPreload(true);
					this.$axios.$post('consentimientos-informados/eliminar-cup/'+item.id)
					.then(res => {
						this.$toast.success('Se eliminó con éxito el cup')
						this.consultarCups(this.consentimiento.codigo)
					}).catch(error => {
						if (error.response.data.mensaje) {
							this.$toast.error(error.response.data.mensaje)
						} else if (error.response.data) {
							this.ErrorEntrada(error.response.data)
						}
						
					}).finally(()=>{
						this.setPreload(false);
					})
				} else {
					return
				}
			})
				
		},


		async guardarConsentimientoInformado() {
			this.setPreload(true)
			this.limpiarError()
			if (this.isEditing === true) { 
				this.setPreload(true);
				this.$axios.put('consentimientos-informados/actualizar', this.consentimiento)
					.then(res => {
						this.$toast.success('Se actualizo con exito')
						this.listarConsentimientosInformados()
						this.close()
					}).catch(error => {
						if (error.response.data.mensaje) {
							this.$toast.error(error.response.data.mensaje)
						} else if (error.response.data) {
							this.ErrorEntrada(error.response.data)
						}
					}).finally(()=>{
						this.setPreload(false);
					})
					
			} else {
				const formData = new FormData();
				formData.append(`nombre`, this.consentimiento.nombre);
				formData.append(`descripcion`, this.consentimiento.descripcion);
				formData.append(`beneficios`, this.consentimiento.beneficios);
				formData.append(`riesgos`, this.consentimiento.riesgos);
				formData.append(`alternativas`, this.consentimiento.alternativas);
				formData.append(`riesgo_no_aceptar`, this.consentimiento.riesgo_no_aceptar);
				formData.append(`informacion`, this.consentimiento.informacion);
				formData.append(`recomendaciones`, this.consentimiento.recomendaciones);
				formData.append(`codigo`, this.consentimiento.codigo);
				formData.append(`version`, this.consentimiento.version);
				formData.append(`laboratorio`, this.consentimiento.laboratorio);
				formData.append(`odontologia`, this.consentimiento.odontologia);
				formData.append(`fecha_aprobacion`, this.consentimiento.fecha_aprobacion);
				for (let i = 0; i < this.consentimiento.cupId.length; i++) {
					formData.append(`cupId[]`, this.consentimiento.cupId[i]);
				}
				this.setPreload(true);
				this.$axios.$post('consentimientos-informados/crear', formData)
					.then(res => {
						this.$toast.success('Se creo con exito')
						this.listarConsentimientosInformados()
						this.close()
					}).catch(error => {
						if (error.response.data.mensaje) {
							this.$toast.error(error.response.data.mensaje)
						} else if (error.response.data) {
							this.ErrorEntrada(error.response.data)
						}
					}).finally(()=>{
						this.setPreload(false);
					})
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
			this.consentimiento = {
				...item,
			};
			if(this.infoCachada[item.codigo]){
				this.cupsConsentimiento = this.infoCachada[item.codigo]
				this.total = this.totalCachado[item.codigo]
			}else{
				this.consultarCups(this.consentimiento.codigo)
			}
			this.dialog = true;
		},

		async estadoFormularioConsentimiento(codigo) {
			try {
				const response = await this.$swal({
					title: "Desea cambiar el estado de consentimiento?",
					text: "Al aceptar este mensaje, se cambiara el estado del consentimiento informado.",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#28a745",
					cancelButtonColor: "#d33",
					confirmButtonText: "Aceptar",
					cancelButtonText: "Cancelar",
				})

				if (response.value) {
					this.setPreload(true);
					await this.$axios.put(`consentimientos-informados/cambiar-estado/${codigo}`)
					await this.listarConsentimientosInformados()
				}
			} catch (error) {
				this.$toast.error("Error al cambiar el estado del consentimiento");
			} finally {
				this.setPreload(false)
			}
		},

		async estadoFormularioLaboratorio(item) {

			try {
				const data = {
					id: item.id,
					codigo: item.codigo
				}

				const response = await this.$swal({
					title: "Desea cambiar la asignación del consentimiento como laboratorio?",
					text: "Al aceptar este mensaje, se cambiará la asignación del consentimiento informado.",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#28a745",
					cancelButtonColor: "#d33",
					confirmButtonText: "Aceptar",
					cancelButtonText: "Cancelar",
				})
				if (response.value) {
					this.setPreload(true);
					await this.$axios.put(`consentimientos-informados/cambiar-laboratorio/`, data)
					await this.listarConsentimientosInformados()
				}
			} catch (error) {
				console.log(error)
				this.$toast.error(error.response.data, { duration: 5000 });
			} finally {
				this.setPreload(false)
			}
		},

		async imprimirConsentimiento(item) {
			this.setPreload(true)
			await this.$axios.post('pdf', {
				tipo: 'consentimientoInformado',
				id: item.cup_id
			}, {
				responseType: "arraybuffer"
			}).then(res => {
				let blob = new Blob([res.data], {
					type: "application/pdf"
				});
				let link = document.createElement("a");
				link.href = window.URL.createObjectURL(blob);
				window.open(link.href, "_blank");
			}).catch(err => {
				this.setPreload(false);
			}).finally(()=>{
				this.setPreload(false)
			})
		},

		chipsEstado(estado) {
			if (estado == true) return 'success'
			else if (estado == false) return 'error'
			else return 'warning'
		},

		chipsEstadoAccion(estado) {
			if (estado == true) return 'error'
			else if (estado == false) return 'success'
			else return 'warning'
		},

	},

};

</script>
