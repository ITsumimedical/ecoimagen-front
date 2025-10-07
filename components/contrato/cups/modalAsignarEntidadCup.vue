<template>
	<v-dialog persistent v-model="mostrarModalEntidadCup" max-width="1200px" scrollable>
		<v-card>
			<v-alert dense text color="info" class="text-center" icon="mdi-file-document-arrow-right-outline">
				<b>Asignar Entidades al CUP {{ ` - ${cup?.codigo} - ${cup?.nombre} ` }} </b>
			</v-alert>
			<v-card-text>
				<v-form ref="formAgregarEntidad">
					<v-row dense class="mt-2">
						<v-col cols="12" sm="12" md="10">
							<v-autocomplete dense outlined multiple chips small-chips clearable deletable-chips
							                label="Seleccione Entidades para asignar *"
							                v-model="entidadesSeleccionadasAgregar"
							                :rules="[rules.minEntidades]" :items="opcionesCups" item-text="nombre"
							                item-value="id" :loading="loading.opcionesCups"/>
						</v-col>
						<v-col col="12" sm="12" md="2">
							<v-btn block dark color="primary" @click="enviarFormulario">
								Agregar
								<v-icon right>mdi-plus-circle-outline</v-icon>
							</v-btn>
						</v-col>
					</v-row>
				</v-form>
				<v-row dense>
					<v-col cols="12" sm="12" md="12" class="mb-2">
						<v-divider></v-divider>
					</v-col>
					<v-col cols="12" sm="12" md="12">
						<v-data-table dense :loading="loading.entidadesCUP" :headers="headersEntidades"
						              :items="entidadesCUP" no-data-text="Sin datos para mostrar"
						              loading-text="Cargando... Por favor espere." show-select
						              :single-select="false"
						              item-key="id"
						              v-model="entidadesSeleccionadasRemover"></v-data-table>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer/>
				<v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
				<v-btn color="warning" dark small @click="removerEntidades()"
				       :disabled="entidadesSeleccionadasRemover.length === 0">
					Remover Entidades ({{ entidadesSeleccionadasRemover.length }})
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>

export default {
	props: {
		mostrarModalEntidadCup: {
			type: Boolean,
			default: false
		},
		cup: {
			type: Object,
			default: () => {
			}
		}
	},
	data() {
		return {
			loading: {
				opcionesCups: false,
				entidadesCUP: false
			},
			opcionesCups: [],
			entidadesSeleccionadasAgregar: [],
			rules: {
				minEntidades: entidades => {
					if (!Array.isArray(entidades)) return 'Debe seleccionar por lo menos una entidad';
					return entidades.length > 0 || 'Debe seleccionar por lo menos una entidad';
				}
			},
			entidadesCUP: [],
			headersEntidades: [
				{text: 'N°', value: 'id', align: 'center'},
				{text: 'Nombre', value: 'nombre', align: 'center'},
			],
			entidadesSeleccionadasRemover: []
		}
	},
	watch: {
		mostrarModalEntidadCup(newValue) {
			if (newValue) {
				this.listarEntidadesUsuario();
				this.listarEntidadesCup();
			}
		}
	},
	methods: {

		cerrarModal() {
			this.entidadesCUP = [];
			this.limpiarFormulario();
			this.$emit('update:mostrarModalEntidadCup', false);
		},

		limpiarFormulario() {
			this.entidadesSeleccionadasAgregar = [];
			this.entidadesSeleccionadasRemover = [];
			this.$refs.formAgregarEntidad.resetValidation();
		},

		async enviarFormulario() {
			if (!this.$refs.formAgregarEntidad.validate()) return;
			try {
				const data = {
					cup_id: this.cup.id,
					entidades: this.entidadesSeleccionadasAgregar
				};

				this.loading.entidadesCUP = true;

				await this.$axios.post('/cup/agregar-entidades-cup', data);

				this.$toast.success('Se han agregado las entidades con éxito');

				this.limpiarFormulario();

				await this.listarEntidadesCup();

			} catch (error) {
				this.$toast.error('Ocurrió un error al asignar las entidades al CUP');
			} finally {
				this.loading.entidadesCUP = false;
			}
		},

		async listarEntidadesUsuario() {
			try {
				this.loading.opcionesCups = true;

				const response = await this.$axios.get('/entidad/listar-entidades-usuario');

				this.opcionesCups = response.data;

			} catch (error) {
				this.$toast.error('Ocurrió un error al listar las entidades')
			} finally {
				this.loading.opcionesCups = false;
			}
		},

		async listarEntidadesCup() {
			try {
				this.loading.entidadesCUP = true;

				const response = await this.$axios.get(`/cup/listar-entidades-cup/${this.cup.id}`);

				this.entidadesCUP = response.data;

			} catch (error) {
				this.$toast.error('Ocurrió un error al listar las entidades del CUP')
			} finally {
				this.loading.entidadesCUP = false;
			}
		},

		async removerEntidades() {
			try {
				const idsEntidades = this.entidadesSeleccionadasRemover.map(entidad => entidad.id);

				const data = {
					cup_id: this.cup.id,
					entidades: idsEntidades
				};

				this.loading.entidadesCUP = true;

				await this.$axios.post(`/cup/remover-entidades-cup`, data);

				this.$toast.success('Se han removido las entidades con éxito');

				this.limpiarFormulario();

				await this.listarEntidadesCup();

			} catch (error) {
				this.$toast.error('Ocurrió un error al remover las entidades')
			} finally {
				this.loading.entidadesCUP = false;
			}
		}
	}
}
</script>

