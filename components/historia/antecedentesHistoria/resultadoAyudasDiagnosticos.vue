<template>
	<div>
		<v-form ref="formAyudasDiagnosticas" lazy-validation v-model="valid">
			<v-col>
				<v-alert text dense icon="mdi-pill" color="info" class="text-center" border="left">
					<b>RESULTADO AYUDAS DIAGNÓSTICAS</b>
				</v-alert>
			</v-col>

			<v-container fluid>
				<v-form ref="formRegistroTranscripcion">
					<v-row align="center" dense>
						<v-col cols="12" sm="6" md="6">
							<v-autocomplete :loading="loading" label="Cup/Servicio"
								no-data-text="Escriba 4 dígitos para realizar la búsqueda"
								v-model="ayudasDiagnosticas.cup_id_resultado_ayudas_diagnosticas" :items="cups"
								item-text="cups" item-value="id" :search-input.sync="FiltroCups" dense
								outlined></v-autocomplete>
						</v-col>
						<v-col cols="12" sm="6" md="6">
							<v-text-field label="Fecha diagnostico" dense outlined type="date" :max="hoy"
								v-model="ayudasDiagnosticas.fecha_realizacion"></v-text-field>
						</v-col>

						<v-col cols="12" sm="12" md="12"
							v-if="cupCondicionados.includes(ayudasDiagnosticas.cup_id_resultado_ayudas_diagnosticas)">

							<v-file-input dense outlined counter multiple show-size chips small-chips deletable-chips
								prepend-icon="" append-icon="mdi-paperclip-plus" accept="image/*, application/pdf"
								truncate-length="1" label="Adjuntos" v-model="adjuntos"></v-file-input>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-alert border="left" colored-border type="error" dense
								v-if="cupCondicionados.includes(ayudasDiagnosticas.cup_id_resultado_ayudas_diagnosticas)">
								<small>El tamaño total de los archivos no debe superar los 50Mb<p> Extensiones
										permitidas:<b><i>jpg,
												jpeg, pdf</i></b></p></small>
							</v-alert>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-textarea auto-grow outlined label="Descripción de los resultados"
								v-model="ayudasDiagnosticas.resultado_ayuda_diagnostica"></v-textarea>
						</v-col>
					</v-row>
					<v-col cols="12" sm="12" md="12" class="d-flex justify-center">
						<v-btn color="success" @click="crearAyudas()">Agregar ayudas</v-btn>
					</v-col>

				</v-form>
			</v-container>

			<template v-if="ayudasDiagnosticasAfiliado.length > 0">
				<v-col cols="12" sm="12" md="12">
					<v-alert text dense color="blue-grey" border="left" class="text-center"><b>HISTÓRICO DE RESULTADOS
							DE AYUDAS
							DIAGNÓSTICAS</b></v-alert>
				</v-col>
				<v-data-table :items="ayudasDiagnosticasAfiliado" :headers="headers" :loading="loading">
                    <template v-slot:[`item.user.operador`]="{ item }">
                          {{ `${item.user.operador?.nombre || ''} ${item.user.operador?.apellido || ''}`.trim() || 'Sin nombre' }}
                    </template>
					<template v-slot:[`item.acciones`]="{ item }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<v-icon small v-bind="attrs" v-on="on" @click="eliminarItem(item)" color="red"
									v-if="item.user_registra_id === $store.state.auth.usuario.id">
									mdi-delete
								</v-icon>
							</template>
							<span v-if="item.user_registra_id === $store.state.auth.usuario.id">Eliminar
								resultado</span>
						</v-tooltip>
					</template>
					<template v-slot:[`item.created_at`]="{ item }">
						{{ item.created_at.substring(0, 10) }}
					</template>


					<template v-slot:[`item.adjuntos`]="{ item }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<v-icon small v-bind="attrs" v-on="on" @click="consultarAdjunto(item)" color="primary"
									v-if="item.user_registra_id === $store.state.auth.usuario.id && ayudasDiagnosticasAfiliado.adjuntos?.length > 0">
									mdi-file-document-multiple
								</v-icon>
							</template>
							<span v-if="item.user_registra_id === $store.state.auth.usuario.id && ayudasDiagnosticasAfiliado.adjuntos?.length > 0">Descargar
								Adjunto</span>
						</v-tooltip>
					</template>

				</v-data-table>

				<v-col cols="12" sm="12" md="12" v-if="datos.cita.tipo_historia_id == 1">
					<v-alert dense type="warning" icon="mdi-information-variant" text><b>¿Al imprimir la historia
							clínica son requeridos
							los registro previos a esta atención?</b></v-alert>
					<v-radio-group v-model="impresionAyudas.imprimir_ayudas_diagnosticas" row :rules="campoRequerido">
						<v-radio label="Si" :value="true"></v-radio>
						<v-radio label="No" :value="false"></v-radio>
					</v-radio-group>
					<v-divider></v-divider>
				</v-col>

			</template>
		</v-form>


		<v-dialog v-model="subidaArchivos.estado" persistent max-width="300px">
			<v-card>
				<v-card-title class="flex justify-center">
					Subiendo Archivos...
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="12" sm="12" md="12" align="center">
							<v-progress-circular :value="subidaArchivos.porcentaje" color="primary" :rotate="360"
								:size="100" :width="15" striped>
								<strong>{{ Math.round(subidaArchivos.porcentaje) }}%</strong>
							</v-progress-circular>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>

</template>

<script>
import { mapActions } from "vuex";

export default {
	props: ['datos', 'resumen'],
	data() {
		return {
			loading: false,
			ayudasDiagnosticas: {
				resultado_ayuda_diagnostica: '',
				cup_id_resultado_ayudas_diagnosticas: '',
				fecha_realizacion: '',
			},
			afiliado: null,
			hoy: this.$moment().format("YYYY-MM-DD"),
			cups: [],
			FiltroCups: '',
			valid: true,
			campoRequerido: [
				v => v !== null && v !== undefined || 'Este campo es requerido',
			],
			ayudasDiagnosticasAfiliado: [],
			impresionAyudas: {
				imprimir_ayudas_diagnosticas: ''
			},
			headers: [
				{
					text: 'Ayuda diagnóstica',
					value: 'cups.nombre',
				},
				{
					text: 'Descripción/resultados',
					value: 'observaciones',
					align: 'center',
				},
				{
					text: 'Registrado por',
					value: 'user.operador',
					align: 'center',
				},
				{
					text: 'Fecha de registro',
					value: 'created_at',
				},
				{
					text: 'Fecha de Realizacion',
					value: 'fecha_realizacion',
				},
				{
					text: 'Acciones',
					value: 'acciones',
					align: 'center',
				},
				{
					text: 'Adjuntos',
					value: 'adjuntos',
					align: 'center',
				}
			],
			adjuntos: [],
			cupCondicionados: [
				12521,
				7309,
				7314,
				7317,
				7346,
			],
			rules: {
				minAdjuntos: adjuntos => {
					if (!Array.isArray(adjuntos)) return 'Debe adjuntar al menos un archivo.';
					return adjuntos.length > 0 || 'Debe adjuntar al menos un archivo.';
				},
				maxSizeAdjuntos: adjuntos => {
					if (!adjuntos || adjuntos.length === 0) return true;
					const totalSize = adjuntos.reduce((sum, file) => sum + file.size, 0);
					const maxSize = 50 * 1024 * 1024; // 50 MB en bytes
					return totalSize <= maxSize || 'El tamaño total de los archivos adjuntos no debe superar los 50 MB.';
				}
			},
			consultaId: null,
			subidaArchivos: {
				estado: false,
				porcentaje: 0
			}
		}
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

	mounted() {
		this.listarAyudasDiagnosticas()
	},

	created() {
		this.impresionAyudas = this.resumen;
	},

	methods: {
		...mapActions('app', ['setPreload']),

		listaCups() {
			this.loading = true;
			this.$axios.post('/cup/buscarCupsNombre', {
				nombre: this.FiltroCups,
				idAfiliado: this.datos.afiliado_id,
				familia_id: [1, 10]
			}).then(res => {
				this.cups = res.data
				this.loading = false;
			}).catch(e => {
				e.response
				this.loading = false;
			})
		},

		async crearAyudas() {
			try {
				this.setPreload(true);
				const formData = new FormData();
				formData.append('consulta_id', this.datos.id,);
				formData.append('cup_id', this.ayudasDiagnosticas.cup_id_resultado_ayudas_diagnosticas);
				formData.append('observaciones', this.ayudasDiagnosticas.resultado_ayuda_diagnostica);
				formData.append('user_registra_id', this.$store.state.auth.usuario.id);
				formData.append('fecha_realizacion', this.ayudasDiagnosticas.fecha_realizacion);
				for (let i = 0; i < this.adjuntos.length; i++) {
					formData.append(`adjuntos[]`, this.adjuntos[i]);
				}

				const response = await this.$axios.post('resultadoAyudas/crear', formData)
				this.$toast.success('Se ha Creado Correctamente');
				this.limpiarFormulario();
				this.listarAyudasDiagnosticas();
			} catch (error) {
				this.$toast.error('Ocurrió un error al registrar la Crear');
			} finally {
				this.setPreload(false);
			}

		},

		listarAyudasDiagnosticas() {
			this.loading = true;
			this.$axios.get('resultadoAyudas/listarAyudas/' + this.datos.afiliado.id).then((res) => {
				this.ayudasDiagnosticasAfiliado = res.data
			}).catch((error) => {
				console.log(error)
			}).finally(() => {
				this.loading = false
			})
		},

		limpiarFormulario() {
			this.ayudasDiagnosticas = {
				cup_id_resultado_ayudas_diagnosticas: '',
				resultado_ayuda_diagnostica: ''
			},
				this.adjuntos = []

		},

		eliminarItem(item) {
			return this.$swal({
				title: '¿Estás seguro?',
				text: "¡No podrás revertir esto!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Sí, eliminarlo!',
				cancelButtonText: 'Cancelar'
			}).then((result) => {
				if (result.value) {
					this.$axios.delete(`resultadoAyudas/eliminar/${item.id}`)
						.then(() => {
							this.$toast.success('Eliminado con éxito');
							this.listarAyudasDiagnosticas();
						})
						.catch((error) => {
							this.$toast.error('Error al eliminar: ' + error.response.data.Error);
						});
				}
			});
		},

		validarErrores() {
			return this.$refs.formAyudasDiagnosticas.validate();
		},

		async consultarAdjunto(item) {
			try {
				if (Array.isArray(item.adjuntos) && item.adjuntos.length > 0) {
					const ruta = item.adjuntos[0].ruta;
					let adj = await this.$adjuntos(ruta);
					let blob = new Blob([adj[1]], {
						type: adj[0],
					});
					let link = document.createElement("a");
					link.href = window.URL.createObjectURL(blob);
					link.click();
					window.open(link.href, "_blank");
				} else {
					console.error("El item no contiene adjuntos válidos.");
				}
			} catch (error) {
				console.log("Error:", error);
				this.$toast.error('Ha ocurrido un error al Ver los Adjuntos')
			}
		}



	}
}

</script>
