<template>

    <div class="size-full flex flex-row justify-center items-center">
        
        <p>
            {{ data }}
        </p>

        <button class="btn btn-accent" @click="send">
            send
        </button>
    </div>

</template>


<script>

export default {
    data()
    {
        return {
            data:{}
        }
    },
    methods:{
        send(ev)
        {
            const onError = (err)=>{};
            const onSuccess = (data)=>{
                this.data = data;
            };
            
            document.request(
                `/api/tel`,
                onSuccess,
                onError,
                {},
                "GET"
            );
        }
    }
}

</script>