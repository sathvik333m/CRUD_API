const db = require("./database");

const express=require("express");
const app=express();

const swaggerUi=require("swagger-ui-express");
const swaggerDocument=require("./openapi.json");

const PORT=3000;

app.use(express.json());

app.get('/',(req,res)=>{
    res.json({
        name:"Task API",
        version:'1.0',
        endpoints:["/tasks"]
    });
});

app.get("/health",(req,res)=>{
    res.json({
        status:'OK'
    });
});


let tasks = [
    {
        id:1,
        title:"Learn Express",
        done:false
    },
    {
        id:2,
        title:"Build CRUD API",
        done:false
    },
    {
        id:3,
        title:"Push to GitHub",
        done:true
    }
];

app.get('/tasks',(req,res)=>{
    const tasks=db.prepare("SELECT * FROM tasks").all();
    res.json(tasks);
});

app.get('/tasks/:id',(req,res)=>{
    const id=Number(req.params.id);

    const task=db.prepare("SELECT * FROM tasks WHERE id= ?").get(id);

    if(!task){
        return res.status(404).json({
            error:`Task ${id} not found`
        });
    }
    return res.json(task);
});

app.post('/tasks',(req,res)=>{
    const {title}=req.body;

    if(!title || title.trim()===''){
        return res.status(400).json({
            error:`Title is needed`
        });
    }
    const task={
        id:tasks.length+1,
        title:title,
        done:false
    }
    tasks.push(task);
    res.status(201).json(task);
});

app.put('/tasks/:id',(req,res)=>{
    const id=Number(req.params.id);
    const task=tasks.find(t=>t.id===id);

    if(!task){
        return res.status(404).json({
            error:"Task not found"
        })
    }
    const {title,done}=req.body;

    if(title===undefined && done===undefined){
        return res.status(400).json({
            error:"Nothing to update"
        })
    }

    if(title!==undefined){
        if(typeof title!=='string' || title.trim()===''){
            return res.status(400).json({
                error:"Task must be non-empty string"
            })
        }
        task.title=title;
    }
    if(done!==undefined){
        task.done=done;
    }
    res.json(task);
})

app.delete("/tasks/:id",(req,res)=>{
    const id=Number(req.params.id);
    const index=tasks.findIndex(t=>t.id===id);

    if(index==-1){
        return res.status(404).json({
            error:"Task not found"
        })
    }
    tasks.splice(index,1);
    return res.sendStatus(204);
});


app.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
