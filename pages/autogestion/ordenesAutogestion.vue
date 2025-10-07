<template>
	<v-card>
		<v-card-title>
			<v-toolbar flat>
				<v-toolbar-title>
					<div class="d-flex align-center">
						<img src="/images/ojo.svg" alt="" height="50px" width="50px" />
						<span>Ordenes</span>
					</div>
				</v-toolbar-title>
				<v-divider class="mx-4" inset vertical></v-divider>
			</v-toolbar>
		</v-card-title>
		<v-card-text>
			<v-tabs v-model="tab" grow>
				<v-tabs-slider color="primary"></v-tabs-slider>
				<v-tab key="tabMedicamentos">Medicamentos</v-tab>
				<v-tab key="tabProcedimientos">Servicios</v-tab>
				<v-tab key="tabIncapacidades">Incapacidades</v-tab>
			</v-tabs>
			<v-tabs-items v-model="tab">
				<v-tab-item key="tabMedicamentos">
					<ordenMedicamentoAutogestion />
				</v-tab-item>
				<v-tab-item key="tabProcedimientos">
					<ordenProcedimientoAutogestion />
				</v-tab-item>
				<v-tab-item key="tabIncapacidades">
					<ordenIncapacidadAutogestion />
				</v-tab-item>
			</v-tabs-items>
		</v-card-text>
	</v-card>
</template>
<script>
	import ordenMedicamentoAutogestion from "@/components/autogestion/ordenMedicamentoAutogestion.vue";
	import ordenProcedimientoAutogestion from "@/components/autogestion/ordenProcedimientoAutogestion.vue";
	import ordenIncapacidadAutogestion from "@/components/autogestion/ordenIncapacidadAutogestion.vue";

	export default {
		components: {
			ordenMedicamentoAutogestion,
			ordenProcedimientoAutogestion,
			ordenIncapacidadAutogestion,
		},
		data() {
			return {
				tab: "tabMedicamentos",
			};
		},
	};

</script>
