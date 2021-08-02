import * as mongoose from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import * as bcrypt  from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
        min: 4,
    },
    username: {
        type: String,
        required: true,
        min: 4,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim : true,
        match : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
    },
    phone:{
        type :"string",
        required : true,
        trim : true,
        match : /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    },
    password : {
        type :"string",
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            require: false
        }
    }]
}, {
    timestamps: true
});


userSchema.methods.encrypPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function(password: string): Promise<boolean>{
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function(){
    const prefix = 6;
    const exp = new Date(new Date().getTime()+(prefix*24*60*60*1000));

    const token = jwt.sign({_id: this._id, username: this.username, email: this.email} , `${process.env.apiSecretKey}`, {expiresIn : `${ exp.getDate()} days`});

    if(this.tokens === undefined) this.tokens=[];
    this.tokens.push({token:token});
    await this.save()
    return token;
}


mongoose.set('useNewUrlParser', true);  
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

export default mongoose.model<IUser>('User', userSchema);
