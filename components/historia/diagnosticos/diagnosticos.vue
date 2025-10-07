<template>
	<div>
		<!-- Preload -->
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

		<!-- Form -->
		<v-form ref="diagnosticos" lazy-validation v-model="formDiagnosticoValido">
			<v-row>
				<v-col cols="12" sm="12" md="12">
					<v-alert dense text type="info" class="text-center" icon="mdi-doctor"> <b>DIAGNÓSTICO DE
							ATENCIÓN</b>
					</v-alert>
				</v-col>
				<v-col cols="12" sm="12" md="6">
					<v-autocomplete v-model="formDiagnosticos.cie10_id" :loading="loading" :items="cie10s"
						item-text="Codigo_Nombre" label="Diagnóstico" item-value="id" :search-input.sync="cie10" dense
						outlined solo no-data-text="Por favor escriba el nombre del diagnostico" required return-object
						:rules="diagnosticoRequerido"></v-autocomplete>
				</v-col>
				<v-col cols="12" sm="12" md="6">
					<v-autocomplete v-model="formDiagnosticos.tipo" :items="tipoDiagnosticos" label="Tipo Diagnóstico" dense
						outlined required :rules="diagnosticoRequerido" solo></v-autocomplete>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<div class="data-table-container">
						<v-data-table :headers="headers" :loading="loading" :items="listaHistorico" :items-per-page="5"
							class="elevation-1" dense disable-pagination loading-text="Cargando... Espere por favor"
							no-data-text="Sin datos para mostrar">
							<template v-slot:[`item.esprimario`]="{ item }">
								<v-chip v-if="item.esprimario" color="success" dark small>SI</v-chip>
								<v-chip v-else color="error" dark small>NO</v-chip>
							</template>
							<template v-slot:[`item.acciones`]="{ item }">
								<v-tooltip top v-if="mostrarBotonEpidemiologia(item)">
									<template v-slot:activator="{ on, attrs }">
										<v-icon color="primary" small v-bind="attrs" v-on="on"
											@click="abrirFormularioEpidemiologia(item)">
											mdi-form-dropdown
										</v-icon>
									</template>
									<span>Formulario Diagnóstico</span>
								</v-tooltip>
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-icon color="warning" small v-bind="attrs" v-on="on"
											@click="eliminarDiagnostico(item)">
											mdi-delete
										</v-icon>
									</template>
									<span>Eliminar</span>
								</v-tooltip>
								<!-- <v-tooltip top v-if="item.esprimario">
                                    <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="info" small v-bind="attrs" v-on="on" @click="seleccionarRecomendaciones(item)">
                                        mdi-download-circle
                                    </v-icon>
                                    </template>
                                    <span>Recomendaciones</span>
                                </v-tooltip> -->
							</template>
						</v-data-table>
					</div>
					<v-col cols="12" md="12" sm="12"
						v-if="datos.cita.tipo_historia_id != 4 && datos.cita.tipo_historia_id != 35">
						<Kaiser :consulta="datos"></Kaiser>
					</v-col>
				</v-col>
			</v-row>
		</v-form>

		<!-- Diálogo para seleccionar recomendaciones -->
		<v-dialog persistent v-model="dialogoSelecRecomendaciones" max-width="800px">
			<v-card>

				<v-alert text dense border="left" color="blue-grey" icon="mdi-select-arrow-down">
					Seleccione las recomendaciones
				</v-alert>
				<v-data-table :headers="headersRecomendaciones" :items="recomendacionesObtenidas" hide-default-footer
					item-value="id" show-select v-model="recomendacionesSeleccionadas" disable-pagination dense
					no-data-text="No hay registro de recomendaciones">
				</v-data-table>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" @click="dialogoSelecRecomendaciones = false" small>
						Cerrar
					</v-btn>
					<v-btn color="success" @click="imprimirSeleccionadas()" small>
						Imprimir
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<FichaEpidemiologia :mostrarFormularioEpidemiologia.sync="mostrarFormularioEpidemiologia"
			:diagnosticoSeleccionado="diagnosticoSeleccionado" ref="respuestas" />

	</div>
</template>
<script>
import Kaiser from "~/components/historia/formularios/escalaKaiser.vue";
import { cie10Permitidos } from "~/utils/cie10-permitidos";
import FichaEpidemiologia from '../formularios/FichaEpidemiologia.vue';

export default {
	name: "diagnosticos",
	props: ['datos', 'resumen'],
	components: {
		Kaiser,
		FichaEpidemiologia,

	},
	watch: {
		cie10(val) {
			if (val) {
				if (val.length === 4) {
					this.listarCie10();
				} else if (val.length < 4) {
					this.cie10s = [];
				}
			} else {
				this.cie10s = [];

			}
		},
		'formDiagnosticos.cie10_id': 'verificarCampos',
		'formDiagnosticos.tipo': 'verificarCampos',
	},
	data() {
		return {
			cie10s: [],
			formDiagnosticoValido: false,
			cie10: null,
			loading: false,
			preload: false,
			formDiagnosticos: {
				cie10_id: null,
				tipo: null,
				esprimario: null,
				consulta_id: null,
			},
			diagnosticoAgregado: [],
			tipoDiagnosticos: ['Impresión diagnóstica', 'Confirmado nuevo', 'Confirmado repetido'],
			headers: [{
				text: 'Diagnóstico',
				value: 'cie10.Codigo_Nombre'
			},
			{
				text: 'Tipo',
				value: 'tipo_diagnostico'
			},
			{
				text: 'Primario',
				value: 'esprimario'
			},
			{
				text: 'Acciones',
				value: 'acciones',
				sortable: false,
				align: 'center'
			},
			],
			headersRecomendaciones: [{
				text: 'Recomendación',
				align: 'start',
				value: 'descripcion'
			},],
			listaHistorico: [],
			dialogoSelecRecomendaciones: false,
			recomendacionesObtenidas: [],
			recomendacionesSeleccionadas: [],
			cie10Permitidos,
			mostrarFormularioEpidemiologia: false,
			diagnosticoSeleccionado: null,

			diagnosticoRequerido: [
				v => !!v || 'Este campo es requerido',
			],
		}
	},
	created() {
		this.listarHistorico()
	},
	methods: {
		limpiarFormulario() {
			this.$refs.diagnosticos.resetValidation();
			this.formDiagnosticos = {};
			this.listarHistorico()
		},
		agregarCie10() {
			const existe = this.listaHistorico.some(
				d => d.cie10_id === this.formDiagnosticos.cie10_id.id
			);

			if (existe) {
				this.formDiagnosticos.tipo === null;
				return this.$toast.error('Este diagnóstico ya fue agregado');
			}
			this.formDiagnosticos.consulta_id = this.datos.id;
			this.preload = true

			// if (this.cie10Permitidos.includes(this.formDiagnosticos.cie10_id.codigo_cie10)) {
			// 	this.$swal({
			// 		title: '¡Evento de reporte Obligatorio!',
			// 		text: `Este diagnóstico esta asociado a un posible evento de salud pública (${this.formDiagnosticos.cie10_id?.evento_sivigila?.nombre_evento}) Recuerda que si aplica debe diligenciar la ficha`,
			// 		type: 'warning',
			// 		showCancelButton: true,
			//         confirmButtonColor: '#3085d6',
			//         cancelButtonColor: '#d33',
			//         confirmButtonText: 'Si, agregar!',
			//         cancelButtonText: 'No',
			//     }).then((result) => {
			//         if (result.value) {
			//             this.formDiagnosticos.cie10_id = this.formDiagnosticos.cie10_id.id;
			//             this.$axios.post("/historia/guardarCie10", this.formDiagnosticos)
			//             .then((res) => {
			//                 // this.$toast.success(res.data.mensaje);
			//                 this.limpiarFormulario();
			//                 this.preload = false
			//             })
			//             .catch((err) => {
			//                 console.log(err);
			//                 return this.$toast.error('Debes diligenciar ambos campos para agregar el diagnóstico');
			//             }).finally(() => {
			//                 this.preload = false
			//             })
			//         }else {
			//             this.preload = false;
			//             return;
			//         }
			//     })
			// }else {
			this.formDiagnosticos.cie10_id = this.formDiagnosticos.cie10_id.id;
			this.$axios.post("/historia/guardarCie10", this.formDiagnosticos)
				.then((res) => {
					// this.$toast.success(res.data.mensaje);
					this.limpiarFormulario();
					this.preload = false
				})
				.catch((err) => {
					console.log(err);
					return this.$toast.error('Debes diligenciar ambos campos para agregar el diagnóstico');
				}).finally(() => {
					this.preload = false
				})
		},

		listarHistorico() {
			let data = {}
			data.consulta = this.datos.id;
			if (this.ocupacional !== undefined) {
				data.consulta = this.ocupacional[0].id
			}
			this.loading = true
			this.$axios.post("/historia/listarCie10Historico", {
				consulta: data.consulta
			}).then((res) => {
				this.listaHistorico = res.data;
			}).catch((err) => {
				return this.$toast.error("Error al listar antecedentes personales");
			}).finally(() => {
				this.loading = false
			})
		},

		listarCie10() {
			const data = {
				valor: this.cie10
			}
			this.loading = true
			this.$axios.$post('cie10/listarFiltro', data).then(res => {
				this.cie10s = res
			}).catch(err => {
				console.log(err)
				this.$toast.error(err.response.data.mensaje)
			}).finally(() => {
				this.loading = false
			})
		},
		eliminarDiagnostico(item) {
			this.$swal({
				title: '¿Está Seguro?',
				text: `Está a punto de eliminar el diagnóstico ${item.cie10.Codigo_Nombre}`,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, eliminar!',
				cancelButtonText: 'Cancelar',
			}).then((result) => {
				if (result.value) {
					this.preload = true
					this.$axios.delete(`/historia/eliminarCie10/${item.id}`, {
						data: { consulta_id: item.consulta_id },
					})
						.then((res) => {
							this.$toast.success(res.data.mensaje)
							this.listarHistorico()
						})
						.catch(() => {
							return this.$toast.error('Error al eliminar diagnóstico')
						})
						.finally(() => {
							this.preload = false
						})
				}
			})
		},

		seleccionarRecomendaciones(item) {
			this.listarRecomendacionesCondicionadas(item)
			this.dialogoSelecRecomendaciones = true
		},

		listarRecomendacionesCondicionadas(item) {
			let datos = {
				consulta_id: item.consulta_id,
				cie10_id: item.cie10_id,
			}
			this.loading = true
			this.$axios.post("/recomendaciones/listarCondicionado", datos).then((res) => {
				this.recomendacionesObtenidas = res.data;
			}).catch((err) => {
				console.log(err);
				return this.$toast.error("Error al listar las recomendaciones");
			}).finally(() => {
				this.loading = false
			})

		},

		imprimirSeleccionadas() {
			if (this.recomendacionesSeleccionadas.length === 0) {
				this.$toast.error('Debe seleccionar al menos una recomendación');
				return;
			}

			let data = {
				tipo: 'recomendacionDiagnosticos',
				recomendaciones: this.recomendacionesSeleccionadas,
				consulta_id: this.datos.id
			};

			this.$axios.post("/pdf", data, {
				responseType: "arraybuffer",
			})
				.then(res => {
					let blob = new Blob([res.data], {
						type: "application/pdf"
					});
					let link = document.createElement("a");
					link.href = window.URL.createObjectURL(blob);
					window.open(link.href, "_blank");
				})
				.catch(err => {
					console.error("Error al generar el PDF:", err);
				});
		},


		abrirFormularioEpidemiologia(item) {
			const datosModal = {
				eventoSivigila: item.cie10?.evento_sivigila,
				consultaId: item.consulta_id,
				eventoId: item.cie10?.evento_sivigila.id,
				afiliadoId: this.datos?.afiliado?.id,
				cie10Id: item.cie10?.id,
				dx: item.cie10?.codigo_cie10,
				sexo: this.datos?.afiliado?.sexo
			}
			this.diagnosticoSeleccionado = datosModal;
			this.mostrarFormularioEpidemiologia = true;
			// this.$nextTick(() => {
			// 	this.$refs.respuestas.consultarRegistroCie10Consulta();
			// });
		},

		mostrarBotonEpidemiologia(item) {

			const fechaNacioneto = this.$moment(this.datos.afiliado.fecha_nacimiento, "YYYY-MM-DD")
			const edad = this.$moment().diff(fechaNacioneto, 'years');

			const edadCumplida = edad || null;
			const rangoInicio = item?.cie10?.evento_sivigila?.rango_edad_inicio;
			const rangoFinal = item?.cie10?.evento_sivigila?.rango_edad_final;
			const esGestante = this.resumen.presente_menarquia || this.resumen.fecha_ultima_menstruacion_gestante || null;
			const gestante = item?.cie10?.evento_sivigila?.gestante || null;

			return (
				this.cie10Permitidos.includes(item?.cie10?.codigo_cie10) &&
				(
					(rangoInicio <= edadCumplida && rangoFinal >= edadCumplida) ||
					(gestante === true && esGestante != null)
				)
			);
		},
		validarErrores() {
			if (!this.listaHistorico || this.listaHistorico.length === 0) {
				const resultado = this.$refs.diagnosticos?.validate?.();
				return resultado;
			} else {
				return true;
			}
		},
		verificarCampos() {
			const { cie10_id, tipo } = this.formDiagnosticos;
			if (cie10_id && tipo) {
				this.validarYAgregar();
			}
		},
		validarYAgregar() {
			const valido = this.$refs.formDiagnostico?.validate?.() ?? true;
			if (valido) {
				this.agregarCie10();
				this.formDiagnosticos.cie10_id = null;
				this.formDiagnosticos.tipo = null;
			}
		},
	}
}
</script>