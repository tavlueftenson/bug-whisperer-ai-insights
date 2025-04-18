
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { DefectData } from "./FileUpload";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DefectAnalyticsProps {
  defects: DefectData[];
  analysis: AnalysisResults;
}

export interface AnalysisResults {
  rootCauses: { name: string; value: number }[];
  reworkRate: number;
  bugBounceRate: number;
  badFixRate: number;
  featureDistribution: { name: string; value: number }[];
  originDistribution: { name: string; value: number }[];
  recommendations: {
    process: string[];
    testCoverage: string[];
    training: string[];
  };
}

// Custom chart colors
const CHART_COLORS = [
  'hsl(var(--chart-purple))', 
  'hsl(var(--chart-blue))', 
  'hsl(var(--chart-amber))',
  'hsl(var(--chart-green))',
  'hsl(var(--chart-red))', 
  'hsl(var(--chart-slate))'
];

export const DefectAnalytics: React.FC<DefectAnalyticsProps> = ({ defects, analysis }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Metrics Cards */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Rework Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analysis.reworkRate}%</div>
          <p className="text-xs text-muted-foreground">Percentage of defects requiring rework</p>
          <Progress className="h-2 mt-2" value={analysis.reworkRate} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Bug Bounce Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analysis.bugBounceRate}%</div>
          <p className="text-xs text-muted-foreground">Defects returned to developers</p>
          <Progress className="h-2 mt-2" value={analysis.bugBounceRate} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Bad Fix Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analysis.badFixRate}%</div>
          <p className="text-xs text-muted-foreground">Fixes causing other issues</p>
          <Progress className="h-2 mt-2" value={analysis.badFixRate} />
        </CardContent>
      </Card>

      {/* Chart and Analysis Tabs */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Defect Distribution Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="root-causes">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="root-causes">Root Causes</TabsTrigger>
              <TabsTrigger value="feature-dist">Feature Distribution</TabsTrigger>
              <TabsTrigger value="origin-dist">Origin Distribution</TabsTrigger>
            </TabsList>
            
            {/* Root Causes Chart */}
            <TabsContent value="root-causes">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.rootCauses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Count" fill="hsl(var(--chart-purple))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            {/* Feature Distribution Chart */}
            <TabsContent value="feature-dist">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysis.featureDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analysis.featureDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            {/* Origin Distribution Chart */}
            <TabsContent value="origin-dist">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysis.originDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analysis.originDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="process">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="process">Process Improvements</TabsTrigger>
              <TabsTrigger value="test">Test Coverage</TabsTrigger>
              <TabsTrigger value="training">Training Needs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="process" className="mt-4 space-y-4">
              <ul className="list-disc pl-5 space-y-2">
                {analysis.recommendations.process.map((rec, idx) => (
                  <li key={idx} className="text-sm">{rec}</li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="test" className="mt-4 space-y-4">
              <ul className="list-disc pl-5 space-y-2">
                {analysis.recommendations.testCoverage.map((rec, idx) => (
                  <li key={idx} className="text-sm">{rec}</li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="training" className="mt-4 space-y-4">
              <ul className="list-disc pl-5 space-y-2">
                {analysis.recommendations.training.map((rec, idx) => (
                  <li key={idx} className="text-sm">{rec}</li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefectAnalytics;
