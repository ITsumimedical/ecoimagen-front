<template>
	<v-row dense v-if="cup">
		<v-col cols="12" sm="12" md="12">
			<v-alert dense text color="blue-grey" icon="mdi-cash-multiple" border="left">
				<b>Tarifas VS Prestador</b>
			</v-alert>
		</v-col>
		<v-col cols="12" sm="12" md="12">
			<v-text-field dense outlined label="Escriba el nombre del Prestador para buscar..." v-model="searchQuery"
			              clearable></v-text-field>
		</v-col>
		<v-col cols="12" sm="12" md="12">
			<template v-if="filteredTarifasPrestador.length > 0">

				<v-virtual-scroll :items="filteredTarifasPrestador" :item-height="80" :height="250">
					<template v-slot:default="{ item }">
						<v-list-item>
							<v-list-item-content>
								<v-alert dense text color="gray" icon="mdi-information-box-outline" border="left"
								         style="height: 70px;">
									<p>
										<strong>{{ item.prestador }}</strong> está con tarifa <strong>{{ item.tarifa }}
										{{
											item.valorTarifa
										}}</strong> con un valor de <strong>$ {{
											item.valor
										}}</strong>
										COP.
									</p>
								</v-alert>
							</v-list-item-content>
						</v-list-item>
					</template>
				</v-virtual-scroll>
			</template>
			<template v-else>
				<v-alert dense text color="error" icon="mdi-alert" border="left" style="height: 70px;">
					<b>No se encontraron tarifas del prestador.</b>
				</v-alert>
			</template>
		</v-col>
	</v-row>
</template>

<script>
import {mapActions} from 'vuex';

export default {
	props: {
		cup: {
			type: Object,
			default: null
		}
	},
	data() {
		return {
			tarifasPrestador: [],
			searchQuery: '' // Variable para la búsqueda
		};
	},
	computed: {
		filteredTarifasPrestador() {
			if (!this.searchQuery) {
				return this.tarifasPrestador;
			}
			return this.tarifasPrestador.filter(item =>
				item.prestador.toLowerCase().includes(this.searchQuery.toLowerCase())
			);
		}
	},
	watch: {
		cup(newValue) {
			if (newValue && newValue.id) {
				this.listarTarifasPrestador();
			}
		}
	},
	methods: {
		...mapActions('app', ['setPreload']),

		async listarTarifasPrestador() {
			try {
				this.setPreload(true);

				const params = {
					cup_id: this.cup.id
				};

				const response = await this.$axios.post("/cup/tarbuscarCupsNombreifasPrestador", params);

				this.tarifasPrestador = response.data;

			} catch (error) {
				this.$toast.error("Ocurrió un error al listar las tarifas del prestador");
			} finally {
				this.setPreload(false);
			}
		},

		limpiarBusqueda() {
			this.searchQuery = '';
		}
	}
};
</script>
