<template>
	<div>
		<v-dialog v-model="mostrarModalEditarContrato" persistent max-width="900px" scrollable>
			<v-card>
				<v-alert dense text border="left" color="primary" icon="mdi-pencil">
					<b>Editar Contrato {{ ` - Contrato N° ${contratoSeleccionado?.id}` }}</b>
				</v-alert>
				<v-card-text>
					<v-form ref="formEditarContrato" v-if="contratoActual" class="mt-2">
						<v-row dense>
							<v-col cols="12" sm="12" md="12">
								<v-text-field dense outlined readonly label="Entidad"
											  :value="contratoActual?.entidad?.nombre || ''"></v-text-field>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<v-autocomplete dense outlined label="Ámbito *" v-model="contratoActual.ambito_id"
												:items="opcionesAmbitos" item-text="nombre" item-value="id"
												:loading="loading.opcionesAmbitos"
												:rules="[rules.obligatorio]"></v-autocomplete>
							</v-col>
							<v-col cols="12" sm="12" md="6">
								<v-menu
									dense
									v-model="menu.fecha_inicio"
									:close-on-content-click="false"
									:nudge-right="40"
									transition="scale-transition"
									offset-y
									min-width="auto"
								>
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											v-model="contratoActual.fecha_inicio"
											label="Fecha de Inicio *"
											prepend-icon=""
											append-icon="mdi-calendar"
											readonly
											dense
											v-bind="attrs"
											v-on="on"
											outlined
											:rules="[rules.obligatorio]"
										></v-text-field>
									</template>
									<v-date-picker
										v-model="contratoActual.fecha_inicio"
										@input="menu.fecha_inicio = false"
									></v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="12" sm="12" md="6">
								<v-menu
									dense
									v-model="menu.fecha_vigencia"
									:close-on-content-click="false"
									:nudge-right="40"
									transition="scale-transition"
									offset-y
									min-width="auto"
								>
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											v-model="contratoActual.fecha_vigencia"
											label="Fecha de Vigencia *"
											prepend-icon=""
											append-icon="mdi-calendar"
											readonly
											dense
											v-bind="attrs"
											v-on="on"
											outlined
											:rules="[rules.obligatorio]"
										></v-text-field>
									</template>
									<v-date-picker
										v-model="contratoActual.fecha_vigencia"
										@input="menu.fecha_vigencia = false"
									></v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<v-file-input dense outlined chips small-chips counter show-size label="Adjunto(s)"
											  truncate-length="15"
											  accept="application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
											  v-model="adjuntos" multiple
											  :rules="[rules.maxSizeAdjuntos]"/>
							</v-col>
						</v-row>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
					<v-btn color="success" small @click="enviarFormulario">Guardar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Progreso de carga -->
		<v-dialog v-model="subidaArchivos.estado" persistent max-width="300px">
			<v-card>
				<v-card-title class="flex justify-center">
					Subiendo Archivos...
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="12" sm="12" md="12" align="center">
							<v-progress-circular :value="subidaArchivos.porcentaje" color="primary" :rotate="360"
												 :size="100"
												 :width="15" striped>
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
import {mapActions} from "vuex";
import {limpiarNombreArchivo} from "@/utils/limpiarNombreArchivo";

export default {
	props: {
		mostrarModalEditarContrato: {
			type: Boolean,
			default: false
		},
		contratoSeleccionado: {
			type: Object,
			default: () => {
			}
		}
	},
	data() {
		return {
			loading: {
				opcionesAmbitos: false
			},
			menu: {
				fecha_inicio: false,
				fecha_vigencia: false
			},
			opcionesAmbitos: [],
			contratoActual: null,
			adjuntos: [],
			rules: {
				obligatorio: v => !!v || 'Este campo es obligatorio.',
				fechaVigenciaValida: v => {
					if (!this.contratoActual.fecha_inicio) return 'Primero selecciona una fecha de inicio.';
					if (new Date(v) < new Date(this.contratoActual.fecha_inicio)) {
						return 'La fecha de vigencia no puede ser anterior a la fecha de inicio.';
					}
					return true;
				},
				maxSizeAdjuntos: adjuntos => {
					if (!adjuntos || adjuntos.length === 0) return true;
					const totalSize = adjuntos.reduce((sum, file) => sum + file.size, 0);
					const maxSize = 50 * 1024 * 1024; // 50 MB en bytes
					return totalSize <= maxSize || 'El tamaño total de los archivos adjuntos no debe superar los 50 MB.';
				}
			},
			subidaArchivos: {
				estado: false,
				porcentaje: 0
			},
			novedadId: null
		}
	},
	watch: {
		mostrarModalEditarContrato(newValue) {
			if (newValue) {
				Promise.all([
					this.listarOpcionesAmbitos(),
					this.listarDetallesContrato()
				]).catch(error => {
					this.$toast.error('Ocurrió un error cargar los detalles iniciales.');
				});
			}
		}
	},
	methods: {
		...mapActions('app', ['setPreload']),

		cerrarModal() {
			this.contratoActual = null;
			this.adjuntos = [];
			this.$emit('update:mostrarModalEditarContrato', false)
		},

		async enviarFormulario() {
			if (!this.$refs.formEditarContrato.validate()) return;
			try {
				const formData = new FormData();

				this.adjuntos = this.adjuntos.map(adjunto => {
					const nombreLimpio = limpiarNombreArchivo(adjunto.name);

					return {
						name: nombreLimpio,
						uuid: window.crypto.randomUUID(),
						size: adjunto.size,
						type: adjunto.type,
						file: adjunto
					};
				});

				formData.append('ambito_id', this.contratoActual.ambito_id);
				formData.append('fecha_inicio', this.contratoActual.fecha_inicio);
				formData.append('fecha_vigencia', this.contratoActual.fecha_vigencia);

				// Agregar adjuntos con sus UUIDs al FormData
				this.adjuntos.forEach((adjunto, index) => {
					formData.append(`adjuntos[${index}][nombre]`, adjunto.name);
					formData.append(`adjuntos[${index}][uuid]`, adjunto.uuid);
				});

				this.setPreload(true);

				const response = await this.$axios.post(`/contratos-medicamentos/editar-contrato/${this.contratoActual.id}`, formData);

				this.$toast.success(response.data.mensaje);

				// Mapeo de URLs por UUID
				const urlMap = {};
				response.data.urls.forEach(item => {
					urlMap[item.uuid] = item.url.url;
				});

				// Asociar cada adjunto con su URL correspondiente
				this.adjuntos.forEach(adjunto => {
					adjunto.url = urlMap[adjunto.uuid];
				});

				this.novedadId = response.data.novedad;

				this.setPreload(false);

				if (this.adjuntos.length > 0) {
					// Subir los archivos
					await this.subirArchivos();
				}

				this.$emit('recargarDatos');

				// Cerrar el modal
				this.cerrarModal();


			} catch (error) {
				console.log({error})
				this.$toast.error('Ocurrió un error al guardar los datos');
			} finally {
				this.setPreload(false);
			}
		},

		async subirArchivos() {
			try {
				this.subidaArchivos.estado = true;
				this.subidaArchivos.porcentaje = 0;

				const adjuntos = this.adjuntos;

				const totalAdjuntos = adjuntos.length;

				let adjuntosSubidos = 0;

				for (const adjunto of adjuntos) {
					if (adjunto.url && adjunto.file) {
						const formData = new FormData();
						formData.append('file', adjunto.file);

						await this.$axios.put(adjunto.url, formData, {
							headers: {
								'Content-Type': adjunto.type
							},
							onUploadProgress: progressEvent => {
								const porcentajeCompletado = Math.round((progressEvent.loaded * 100) / progressEvent.total);
								// Actualiza el progreso de la subida basado en los adjuntos subidos
								const progresoActual = ((adjuntosSubidos + porcentajeCompletado / 100) / totalAdjuntos) * 100;
								this.subidaArchivos.porcentaje = Math.min(progresoActual, 100);
							}
						});

						adjuntosSubidos += 1;

						// Actualiza el progreso de la subida basado en los adjuntos subidos
						this.subidaArchivos.porcentaje = Math.round((adjuntosSubidos / totalAdjuntos) * 100);
					}
				}

				this.$toast.success('Todos los adjuntos fueron subidos correctamente');

				// Después de subir los archivos, guardar la información de estos
				await this.guardarInformacionAdjuntos();

			} catch (error) {
				console.log({error})
				this.$toast.error('Ocurrió un error al subir los adjuntos');
			} finally {
				this.subidaArchivos.estado = false;
				this.subidaArchivos.porcentaje = 0;
			}
		},

		async guardarInformacionAdjuntos() {
			try {
				const adjuntos = this.adjuntos;

				// Iterar sobre los adjuntos y extraer la información necesaria
				const dataAdjuntos = adjuntos.map(adjunto => {
					const url = new URL(adjunto.url); // Crear un objeto URL
					const rutaArchivo = url.pathname; // Obtener el pathname
					return {
						novedad_contrato_medicamentos_id: this.novedadId,
						nombreArchivo: adjunto.name, // Agregar el nombre del archivo
						rutaArchivo: rutaArchivo // Ruta extraída
					};
				});

				// Enviar los datos al backend
				await this.$axios.post('/contratos-medicamentos/guardar-informacion-adjuntos', {adjuntos: dataAdjuntos});

				this.$toast.success('Información de los adjuntos guardada correctamente');


			} catch (error) {
				this.$toast.error('Ocurrió un error al guardar la informacion de los adjuntos');
			}
		},


		async listarDetallesContrato() {
			try {
				this.setPreload(true);

				const response = await this.$axios.get(`/contratos-medicamentos/listar-detalles-contrato/${this.contratoSeleccionado.id}`);

				this.contratoActual = response.data;

			} catch (error) {
				this.$toast.error('Ocurrió un error al listar los detalles del contrato');
			} finally {
				this.setPreload(false);
			}
		}
		,

		async listarOpcionesAmbitos() {
			try {
				this.loading.opcionesAmbitos = true;
				const response = await this.$axios.get('/ambito');
				this.opcionesAmbitos = response.data;
			} catch (error) {
				this.$toast.error('Ocurrió un error al listar los ambitos');
			} finally {
				this.loading.opcionesAmbitos = false;
			}
		}
		,
	}
}
</script>
