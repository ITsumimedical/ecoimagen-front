<template>
	<v-dialog persistent scrollable fullscreen v-model="mostrarModalEditarCup">
		<v-card>
			<v-alert dense text color="info" class="text-center" icon="mdi-grease-pencil">
				<b>Editar CUP {{ ` - ${cupSeleccionado?.codigo} - ${cupSeleccionado?.nombre} ` }} </b>
			</v-alert>
			<v-card-text>
				<v-row dense class="mt-2">
					<v-col cols="12" sm="12" md="12">
						<form-editar-cup :cup="cup" />
					</v-col>
					<v-col cols="12" sm="12" md="12" class="my-2">
						<v-divider></v-divider>
					</v-col>
					<v-col cols="12" sm="12" md="12">
						<tarifas-prestador-cup :cup="cup" ref="tarifasPrestadorCup" />
					</v-col>
					<v-col cols="12" sm="12" md="12" class="my-2">
						<v-divider></v-divider>
					</v-col>
					<v-col cosl=12 sm="12" md="12">
						<parametros-por-entidad :cup="cup" />
					</v-col>
					<v-col cols="12" sm="12" md="12" class="my-2">
						<v-divider></v-divider>
					</v-col>
					<v-col cosl=12 sm="12" md="12">
						<familias-cup-entidad :cup="cup" />
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn small dark color="error" @click="cerrarModal"> Salir</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>

import { mapActions } from "vuex";
import FormEditarCup from "@/components/contrato/cups/formEditarCup.vue";
import TarifasPrestadorCup from '@/components/contrato/cups/tarifasPrestadorCup.vue';
import ParametrosPorEntidad from '@/components/contrato/cups/parametrosPorEntidad.vue';
import FamiliasCupEntidad from '@/components/contrato/cups/familiasCupEntidad.vue';

export default {
	components: {
		FormEditarCup,
		TarifasPrestadorCup,
		ParametrosPorEntidad,
		FamiliasCupEntidad
	},
	props: {
		mostrarModalEditarCup: {
			type: Boolean,
			default: false
		},
		cupSeleccionado: {
			type: Object,
			default: () => {
			}
		}
	},
	data() {
		return {
			cup: null
		}
	},
	watch: {
		mostrarModalEditarCup(newValue) {
			if (newValue) {
				this.listarDetallesCup();
			}
		}
	},
	methods: {
		...mapActions('app', ['setPreload']),

		cerrarModal() {
			this.$refs.tarifasPrestadorCup.limpiarBusqueda();
			this.cup = null;
			this.$emit('update:mostrarModalEditarCup', false);
		},

		async listarDetallesCup() {
			try {
				this.setPreload(true);

				const response = await this.$axios.get(`/cup/listar-detalles-cup/${this.cupSeleccionado.id}`);

				this.cup = response.data;

			} catch (error) {
				console.log({ error })
				this.$toast.error('Ocurrió un error al listar los detalles del CUP');
			} finally {
				this.setPreload(false);
			}
		}
	}
}
</script>
