<template>
	<v-dialog v-model="mostrarModalAgregarDiagnosticos" persistent max-width="1200px" scrollable>
		<v-card>
			<v-alert dense text border="left" icon="mdi-list-box-outline" type="info" color="info" class="text-center">
				<b>Parametrizar Diagnósticos{{ ` - ${programaSeleccionado?.nombre} ` }}</b>
			</v-alert>
			<v-card-text>
				<v-form ref="formAgregarDiagnositco" class="mt-2">
					<v-row dense>
						<v-col cols="12" sm="12" md="10">
							<v-autocomplete dense outlined label="Diagnósticos" :loading="loading.opcionesDiagnosticos"
							                multiple chips deletable-chips small-chips item-text="nombre"
							                item-value="id" v-model="programasSeleccionadosAgregar"
							                :rules="[rules.diagnosticoMinimo]"
							                :items="opcionesDiagnosticos"
							                clearable
							></v-autocomplete>
						</v-col>
						<v-col cols="12" sm="12" md="2">
							<v-btn block small color="primary" @click="agregarDiagnosticosPrograma">
								Agregar
								<v-icon right small>mdi-plus-circle-outline</v-icon>
							</v-btn>
						</v-col>
					</v-row>
				</v-form>
				<v-row dense>
					<v-col cols="12" sm="12" md="12" class="mt-2">
						<v-divider/>
					</v-col>
					<v-col cols="12" sm="12" md="12">
						<v-data-table dense :headers="headersDiagnosticosPrograma"
						              :items="diagnosticosPrograma"
						              :loading="loading.diagnosticosPrograma"
						              loading-text="Cargando... Por favor espere"
						              no-data-text="Este programa no tiene diagnósticos asignados"
						              show-select
						              :single-select="false"
						              item-key="id"
						              v-model="programasSeleccionadosRemover"
						></v-data-table>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="red" dark small @click="cerrarModal()">Salir</v-btn>
				<v-btn color="warning" dark small @click="removerDiagnosticosPrograma()"
				       :disabled="programasSeleccionadosRemover.length === 0">
					Remover Diagnósticos ({{ programasSeleccionadosRemover.length }})
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	props: {
		mostrarModalAgregarDiagnosticos: {type: Boolean, default: false},
		programaSeleccionado: {
			type: Object, default: () => {
			}
		}
	},
	data() {
		return {
			loading: {
				diagnosticosPrograma: false,
				opcionesDiagnosticos: false
			},
			diagnosticosPrograma: [],
			headersDiagnosticosPrograma: [
				{text: 'N°', value: 'id', align: 'center'},
				{text: 'Código', value: 'codigo_cie10', align: 'center'},
				{text: 'Descripción', value: 'nombre', align: 'center'},
			],
			programasSeleccionadosRemover: [],
			programasSeleccionadosAgregar: [],
			opcionesDiagnosticos: [],
			rules: {
				diagnosticoMinimo: (v) =>
					(v && v.length > 0) || "Debes seleccionar al menos un diagnóstico.",
			}
		}
	},
	watch: {
		mostrarModalAgregarDiagnosticos(newValue) {
			if (newValue) {
				this.listarDiagnosticosPrograma();
				this.listarOpcionesDiagnosticos();
			}
		}
	},
	methods: {
		cerrarModal() {
			this.diagnosticosPrograma = [];
			this.limpiarFormulario();
			this.$emit('update:mostrarModalAgregarDiagnosticos', false)
		},

		async listarDiagnosticosPrograma() {
			try {
				this.loading.diagnosticosPrograma = true;

				const response = await this.$axios.get(`/programa-farmacia/listar-diagnosticos-programa/${this.programaSeleccionado.id}`);

				this.diagnosticosPrograma = response.data;

			} catch (error) {
				this.$toast.error('Ocurrió un error obteniendo los diagnósticos');
			} finally {
				this.loading.diagnosticosPrograma = false;
			}
		},

		async listarOpcionesDiagnosticos() {
			try {
				this.loading.opcionesDiagnosticos = true;
				const response = await this.$axios.get('/cie10/listar');
				this.opcionesDiagnosticos = response.data.map(diagnostico => {
					return {
						id: diagnostico.id,
						nombre: `${diagnostico.codigo_cie10} - ${diagnostico.nombre}`
					}
				});
			} catch (error) {
				this.$toast.error('Ocurrió un error al listar los diagnósticos');
			} finally {
				this.loading.opcionesDiagnosticos = false;
			}
		},

		limpiarFormulario() {
			this.programasSeleccionadosRemover = [];
			this.programasSeleccionadosAgregar = [];
			this.$refs.formAgregarDiagnositco.resetValidation();
		},

		async agregarDiagnosticosPrograma() {
			if (!this.$refs.formAgregarDiagnositco.validate()) return;
			try {
				this.loading.diagnosticosPrograma = true;


				const response = await this.$axios.post(`/programa-farmacia/asociar-diagnosticos/${this.programaSeleccionado.id}`, {
					diagnosticos: this.programasSeleccionadosAgregar
				});

				this.limpiarFormulario();

				await this.listarDiagnosticosPrograma();

			} catch (error) {
				console.log({error})
				this.$toast.error(error.response.data.error ?? 'Ocurrió un error al agregar los diagnósiticos.');
			} finally {
				this.loading.diagnosticosPrograma = false;
			}
		},

		async removerDiagnosticosPrograma() {
			const idsProgramas = this.programasSeleccionadosRemover.map(programa => programa.id);

			try {
				this.loading.diagnosticosPrograma = true;

				const response = await this.$axios.post(`/programa-farmacia/remover-diagnosticos/${this.programaSeleccionado.id}`, {
					diagnosticos: idsProgramas
				});
				this.limpiarFormulario();
				await this.listarDiagnosticosPrograma();

			} catch (error) {
				this.$toast.error(error.response.data.mensaje ?? 'Ocurrió un error al remover los diagnósticos');

			} finally {
				this.loading.diagnosticosPrograma = false;
			}
		}
	}

}
</script>

