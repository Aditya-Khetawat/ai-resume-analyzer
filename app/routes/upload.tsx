import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);
        const startTime = Date.now();

        try {
            console.log("Starting resume analysis flow...");
            
            setStatusText('Uploading the file...');
            console.log("Step 1: Uploading resume PDF...");
            const uploadedFile = await fs.upload([file]);
            if(!uploadedFile) throw new Error('Failed to upload resume file');
            console.log("Resume PDF uploaded to:", uploadedFile.path);

            setStatusText('Converting to image...');
            console.log("Step 2: Converting PDF to image for extraction...");
            const imageStartTime = Date.now();
            const imageFile = await convertPdfToImage(file);
            if(!imageFile.file) throw new Error(imageFile.error || 'Failed to convert PDF to image');
            console.log(`PDF converted to image in ${Date.now() - imageStartTime}ms`);

            setStatusText('Uploading the image...');
            console.log("Step 3: Uploading converted image...");
            const uploadedImage = await fs.upload([imageFile.file]);
            if(!uploadedImage) throw new Error('Failed to upload image file');
            console.log("Image uploaded to:", uploadedImage.path);

            setStatusText('Preparing data...');
            console.log("Step 4: Initializing analysis record in KV storage...");
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName, jobTitle, jobDescription,
                feedback: '',
            }
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            console.log("Initial record created with UUID:", uuid);

            setStatusText('Analyzing...');
            console.log("Step 5: Calling Puter AI for analysis...");
            const aiStartTime = Date.now();
            
            // Adding a timeout to the AI call
            const feedbackPromise = ai.feedback(
                uploadedFile.path,
                prepareInstructions({ jobTitle, jobDescription })
            );

            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('AI analysis timed out after 60 seconds')), 60000)
            );

            const feedback = await Promise.race([feedbackPromise, timeoutPromise]) as any;
            
            if (!feedback) throw new Error('Puter AI returned no feedback');
            console.log(`AI analysis completed in ${Date.now() - aiStartTime}ms`);

            console.log("Step 6: Parsing AI response...");
            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0].text;

            try {
                data.feedback = JSON.parse(feedbackText);
                console.log("Successfully parsed AI response JSON");
            } catch (parseError) {
                console.error("Failed to parse AI response as JSON:", feedbackText);
                throw new Error('AI returned an invalid response format');
            }

            console.log("Step 7: Saving final results to KV storage...");
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            
            setStatusText('Analysis complete, redirecting...');
            const totalDuration = Date.now() - startTime;
            console.log(`Resume analysis flow finished successfully in ${totalDuration}ms`);
            
            navigate(`/resume/${uuid}`);
        } catch (error: any) {
            console.error("Resume Analysis Error:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            setStatusText(`Error: ${errorMessage}`);
            // Display an alert or keep the error on screen for the user
            alert(`Analysis failed: ${errorMessage}`);
        } finally {
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload