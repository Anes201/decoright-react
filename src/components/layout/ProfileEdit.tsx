import useAuth from "@/hooks/useAuth";
import Spinner from "@components/common/Spinner";
import type { Database } from "@/types/database.types";
import { images } from "@/constants";
import { EmailInput, Input, PhoneInput } from "../ui/Input";
import { PButton, SButton } from "../ui/Button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PATHS } from "@/routers/Paths";
import { Navigate, useNavigate } from "react-router-dom";
import { RequestService } from "@/services/request.service";

type ProfileData = Database['public']['Tables']['profiles']['Row'];

export function ProfileEdit(){
    const { user, loading: authLoading } = useAuth()
    const navigate = useNavigate() // moved to top-level hook call
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            setLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setProfile(data);

                // populate form fields with fetched data (use `data`, not `profile` state)
                const fullName = data?.full_name ?? '';
                const [first = '', ...rest] = fullName.split(' ');
                setFirstName(first);
                setLastName(rest.join(' '));
                setPhone(data?.phone ?? '');

            } catch (err: any) {
                console.error("Error fetching profile:", err);
                setError(err?.message ?? String(err));
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchProfile();
        }
    }, [user, authLoading]);

    if (authLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 h-hero">
                <Spinner status={authLoading} />
                <span className="text-xs"> Verifying… </span>
            </div>
        );
    }

    if (!user) return <Navigate to={PATHS.LOGIN} replace />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!firstName || !lastName ) {
            setError("First and Last name are required.")
            return
        }

        setLoadingSubmit(true)
        setError(null)

        try {
            // checking for active requests with specific status
            const CHECK_STATUS = 'in_progress';

            // check if user has any request with that status to prevent phone update
            const requests = await RequestService.getMyRequests();
            const activeReq = requests?.find((req: any) => req.status === CHECK_STATUS);

            if (activeReq) {
                setError(`You have an active request with status "${CHECK_STATUS}". Cannot update phone while that request is active.`);
                setLoadingSubmit(false);
                return;
            }

            const fullName = `${firstName} ${lastName}`.trim();
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: fullName, phone })
                .eq('id', user?.id);

            if (error) throw error;

            // optional: navigate back to profile on success
            navigate(PATHS.CLIENT.PROFILE);

        } catch (err: any) {
            console.error("Error updating profile:", err);
            setError(err?.message ?? String(err));
        } finally {
            setLoadingSubmit(false);
        }
    }

    const handleCancel = () => {
        navigate(PATHS.CLIENT.PROFILE);
    }

    return (
        <section className="h-hero min-h-hero max-w-180 mx-auto relative flex flex-col items-center justify-center w-full mt-8">

            <div className="absolute right-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-l-to-transparent mask-l-to-30% overflow-hidden"></div>

            <div className="relative w-full h-full px-4 py-4 md:px-8 md:py-8">
                <div className="absolute top-0 left-0 w-full h-full border border-muted/15 rounded-4xl bg-surface/75 -z-10 mask-b-to-transparent mask-b-to-100%"></div>
                <div className="absolute top-20 md:top-35 left-0 w-full border-b border-b-muted/15 -z-10"></div>

                {loading
                ?
                <div className="flex flex-col items-center justify-center gap-4 h-full">
                    <Spinner status={loading} />
                    <span className="text-xs"> Loading profile... </span>
                </div>
                :
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8 max-md:flex-col" encType="multipart/form-data">

                    {/* Profile Image */}
                    <div className="group/item relative w-fit h-25 md:h-40 p-1 md:p-2 aspect-square border border-muted/15 rounded-full bg-background overflow-hidden">
                        {/* <label htmlFor="fileToUpload" className="absolute hidden group-hover:item:flex group-active:item:flex items-center justify-center top-0 left-0 w-full h-full bg-muted/35 cursor-pointer"> {ICONS.arrowUpTray({className:'text-white size-8'})} </label>
                        <input type="file" name="fileToUpload" id="fileToUpload" className="hidden" /> */}
                        <img src={images[7]} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    </div>


                    <div className="flex flex-col w-full gap-3 md:gap-4">

                        <div className="flex max-xs:flex-col md:flex-col lg:flex-row gap-3 md:gap-4 w-full">
                            <Input type="text" placeholder="First name" value={firstName} onChange={(e: any) => setFirstName(e.target.value)} className={'bg-emphasis/75'} />
                            <Input type="text" placeholder="Last name" value={lastName} onChange={(e: any) => setLastName(e.target.value)} className={'bg-emphasis/75'}  />
                        </div>

                        <EmailInput className={'bg-muted/5'} readOnly={true} defaultValue={user.email} />

                        <PhoneInput className={'bg-emphasis/75'} value={phone} onChange={(e: any) => setPhone(e.target.value)} />

                        {/* CTA */}
                        <div className="flex max-xs:flex-col md:flex-row gap-4 w-full md:w-fit mt-4">

                            <PButton type="submit" className="w-full" disabled={loadingSubmit}>
                                <Spinner status={loadingSubmit} size="sm"> Save Changes </Spinner>
                            </PButton>
                            <SButton type="button" onClick={handleCancel} className="w-full"> Cancel </SButton>
                        </div>

                    </div>



                </form>
                }

            </div>

            <div className="absolute left-full w-full h-[calc(100svh-24rem)] md:h-[calc(100svh-22rem)] border border-muted/20 rounded-4xl mask-r-to-transparent mask-r-to-30% overflow-hidden"></div>
        </section>
    )
}