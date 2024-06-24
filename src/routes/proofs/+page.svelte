<script lang="ts">
	import TransactionAnalysis from '$lib/components/admin/TransactionAnalysis.svelte';
	import { sessionStore } from '$stores/stores';

</script>

<div class="mx-auto md:w-3/5 w-full p-6 py-6">
	<div class="my-8">
	  <div class="mx-auto w-full">
	  <div class="flex flex-col w-full p-5 gap-10 items-start bg-gray-1000 border-[0.5px] border-gray-700 rounded-lg">
		<TransactionAnalysis feature={'merkel-tree'} txId={$sessionStore.userSettings.testAddress || ''}/>
	</div>
</div>
</div>
</div>

<section class="">
</section>
